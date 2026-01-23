import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import type { Env } from '../../env';

import { duckDuckGoSearch } from './searchEngine/duckduckgo';
import { googleSearch } from './searchEngine/google';
import { braveSearch } from './searchEngine/brave';

import { normalizeDDG, normalizeGoogle, normalizeBrave } from './searchEngine/searchNormalizer';
import { mergeAndDedupe } from './helpers/dedupe';

import { getFinalResult, getSearchQuery, getWhichURL } from './AI/searchAI';
import { normalizeUrl } from './helpers/url';
import { getHtml, cleanHtml, estimateTokens } from './helpers/html';

import { handleLlama, llamaToString } from '../../model/llama';
import { writeUserData, getUserData } from '../../memory/helpers';
import { truncateHistoryByTokens } from './helpers/history';

import type { SearchParams } from '../types/params';
import type { WriteStoreInput } from '../types/writeDB';

type ChatHistoryItem = {
	user: string;
	assistant: string;
};

function isChatHistoryArray(data: unknown): data is ChatHistoryItem[] {
	return (
		Array.isArray(data) &&
		data.every(
			(i) => typeof i === 'object' && i !== null && typeof (i as any).user === 'string' && typeof (i as any).assistant === 'string',
		)
	);
}

export class SearchWorkflow extends WorkflowEntrypoint<Env, SearchParams> {
	async run(event: WorkflowEvent<SearchParams>, step: WorkflowStep) {
		const userQuery = event.payload.message;

		/* ---------------- STEP 0 — HISTORY ---------------- */
		const recentHistory = await step.do('get-history', async () => {
			const res = await getUserData(this.env, event.payload.clerkId, false);
			if (!res.ok) return { historyText: '', responseCount: 0, tokenCount: 0 };

			const data = await res.json();
			if (!isChatHistoryArray(data)) {
				return { historyText: '', responseCount: 0, tokenCount: 0 };
			}

			const { truncatedHistory, responseCount, tokenCount } = truncateHistoryByTokens(data, 800);

			return {
				historyText: truncatedHistory.map((m) => `User: ${m.user}\nAssistant: ${m.assistant}`).join('\n'),
				responseCount,
				tokenCount,
			};
		});

		/* ---------------- STEP 0.5 — QUERY ---------------- */
		const refinedQuery = await step.do('generate-query', async () => {
			const prompt = recentHistory.responseCount === 0 ? userQuery : `${userQuery}\n\nContext:\n${recentHistory.historyText}`;

			return getSearchQuery(prompt, this.env);
		});

		/* ---------------- SEARCH ---------------- */
		const [braveRaw, ddgRaw, googleRaw] = await Promise.all([
			braveSearch(refinedQuery, this.env).catch(() => []),
			duckDuckGoSearch(refinedQuery).catch(() => null),
			googleSearch(refinedQuery, this.env).catch(() => null),
		]);

		const mergedResults = mergeAndDedupe([
			...(ddgRaw ? normalizeDDG(ddgRaw) : []),
			...(braveRaw.length ? normalizeBrave(braveRaw) : []),
			...(googleRaw ? normalizeGoogle(googleRaw) : []),
		]);

		/* ---------------- URL PICK ---------------- */
		const bestUrl = await step.do('choose-url', async () => getWhichURL(userQuery, mergedResults, this.env));

		const finalURL = bestUrl ? normalizeUrl(bestUrl) : null;

		/* ---------------- HTML ---------------- */

		if (!finalURL) {
			return null;
		}

		const g = await getHtml(finalURL);

		if (!g) return null;

		const html = finalURL ? cleanHtml(g) : null;

		/* ---------------- TOKEN GUARD + REDUCER ---------------- */
		const safeHtml = await step.do('token-guard', async () => {
			if (!html) return null;

			let current = html;
			const MAX = 7000;
			const baseTokens = estimateTokens(userQuery) + recentHistory.tokenCount;

			let tokens = estimateTokens(current) + baseTokens;
			let attempts = 0;

			while (tokens > MAX && attempts < 3) {
				attempts++;

				const reduced = await handleLlama(current, `Reduce HTML to only facts relevant to:\n"${userQuery}"`, this.env);

				const reducedText = llamaToString(reduced);
				if (!reducedText || reducedText.length < 100) break;

				current = reducedText;
				tokens = estimateTokens(current) + baseTokens;
			}

			return current;
		});

		/* ---------------- FINAL ANSWER ---------------- */
		let finalPrompt = `
User question:
${userQuery}

Previous context:
${recentHistory.historyText}

${safeHtml ? `Web content:\n${safeHtml}` : 'No web content available.'}
`;

		// HARD FINAL TOKEN GUARD
		if (estimateTokens(finalPrompt) > 7000) {
			finalPrompt = `Answer concisely:\n${userQuery}`;
		}

		const finalAnswer = await step.do('final-answer', async () => getFinalResult(finalPrompt, this.env));

		/* ---------------- STORE ---------------- */
		const safeFinal = typeof finalAnswer === 'string' && finalAnswer.trim().length ? finalAnswer : '⚠️ Model returned no response.';

		const usrData: WriteStoreInput = {
			clerkUserId: event.payload.clerkId,
			workflowId: event.instanceId,
			originalQuery: userQuery,
			refinedQuery,
			finalUrl: finalURL,
			finalAnswer: safeFinal,
		};

		const storeRes = await writeUserData(this.env, usrData);

		return {
			originalQuery: userQuery,
			refinedQuery,
			finalURL,
			finalAnswer: safeFinal,
			storeInD2: { ok: storeRes.ok, status: storeRes.status },
		};
	}
}
