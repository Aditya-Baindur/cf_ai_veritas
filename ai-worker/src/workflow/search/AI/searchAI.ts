import { handleLlama, llamaToString } from '../../../model/llama';
import type { Env } from '../../../env';
import type { UnifiedSearchResult } from '../../types/normalizedResults';

import { SEARCH_QUERY, WHICH_URL, MAIN_SP } from './SystemPrompts';
import { normalizeUrl } from '../helpers/url';

/* --------------------------------------------------
   STEP 0 — Generate refined search query
-------------------------------------------------- */
export async function getSearchQuery(userMessage: string, env: Env): Promise<string> {
	const res = await handleLlama(userMessage, SEARCH_QUERY, env);
	const text = llamaToString(res);

	if (!text) {
		throw new Error('LLM returned empty refined search query');
	}

	return text;
}

/* --------------------------------------------------
   STEP 5 — AI choose best URL
-------------------------------------------------- */
export async function getWhichURL(userMessage: string, urlList: UnifiedSearchResult[], env: Env): Promise<string | null> {
	if (!Array.isArray(urlList) || urlList.length === 0) {
		return null;
	}

	const candidates = urlList.slice(0, 25).map((r, i) => ({
		index: i + 1,
		title: r.title,
		url: r.url,
		source: r.source,
		description: r.description ?? null,
	}));

	const prompt = `
User query:
${userMessage}

You are given a list of candidate URLs in JSON.

${JSON.stringify(candidates, null, 2)}

Rules:
- Return ONLY ONE URL string
- Output NONE if no URL is appropriate
- No explanation
- No markdown
`;

	const res = await handleLlama(prompt, WHICH_URL, env);
	const clean = llamaToString(res);

	if (!clean || clean === 'NONE') {
		return null;
	}

	if (!clean.startsWith('http')) {
		throw new Error(`LLM returned invalid URL: ${clean}`);
	}

	return normalizeUrl(clean);
}

/* --------------------------------------------------
   STEP 11 — Final AI answer
-------------------------------------------------- */
export async function getFinalResult(userMessage: string, env: Env): Promise<string> {
	const res = await handleLlama(userMessage, MAIN_SP, env);
	const text = llamaToString(res);

	if (!text) {
		return 'I’m sorry — I couldn’t generate a response for this request.';
	}

	return text;
}
