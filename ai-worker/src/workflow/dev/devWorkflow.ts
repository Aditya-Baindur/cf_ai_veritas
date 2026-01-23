// DevWorkflow.ts
import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import type { Env } from '../../env';

import { handleLlama, llamaToString } from '../../model/llama';
import { writeUserData, getUserData } from '../../memory/helpers';
import { truncateHistoryByTokens } from '../search/helpers/history';

import type { WriteStoreInput } from '../types/writeDB';
import type { DevParams } from '../types/params';

import { buildGraphNeverFail } from './graph/failsafe-build-graph';
import { CF_PRODUCTS } from './graph/failsafe-build-graph';
import { FINAL_ANSWER_PROMPT, SYSTEM_PROMPT, USER_PROMPT } from './graph/graphPrompts';

type ChatHistoryItem = { user: string; assistant: string };

function isChatHistoryArray(data: unknown): data is ChatHistoryItem[] {
	return (
		Array.isArray(data) &&
		data.every(
			(i) => typeof i === 'object' && i !== null && typeof (i as any).user === 'string' && typeof (i as any).assistant === 'string',
		)
	);
}

export class DevWorkflow extends WorkflowEntrypoint<Env, DevParams> {
	async run(event: WorkflowEvent<DevParams>, step: WorkflowStep) {
		const userQuery = event.payload.message;
		const clerkId = event.payload.clerkId;

		const history = await step.do('load-history', async () => {
			const res = await getUserData(this.env, clerkId, true);
			if (!res.ok) return { text: '' };

			const json = await res.json();
			if (!isChatHistoryArray(json)) return { text: '' };

			const { truncatedHistory } = truncateHistoryByTokens(json, 800);

			return {
				text: truncatedHistory.map((m) => `User: ${m.user}\nAssistant: ${m.assistant}`).join('\n'),
			};
		});

		const ideaBuilder = await step.do('graph-idea-builder', async () => {
			const res = await handleLlama(USER_PROMPT(userQuery, history.text ?? 'First Message by User'), SYSTEM_PROMPT(), this.env);

			return llamaToString(res) ?? 'Failed';
		});

		const graphResult = await step.do('validate-json', async () => {
			return buildGraphNeverFail({
				env: this.env,
				explanation: ideaBuilder,
				cfProdLst: JSON.stringify(CF_PRODUCTS),
			});
		});

		const finalAnswer = await step.do('graph-idea-builder', async () => {
			const res = await handleLlama(
				FINAL_ANSWER_PROMPT(userQuery, graphResult.mermaid, history.text ?? 'First Message by User'),
				SYSTEM_PROMPT(),
				this.env,
			);

			return llamaToString(res) ?? 'Failed';
		});

		const store = await step.do('store', async () => {
			const payload: WriteStoreInput = {
				clerkUserId: clerkId,
				workflowId: event.instanceId,
				originalQuery: userQuery,
				refinedQuery: null,
				finalUrl: null,
				finalAnswer,
				graph: graphResult.mermaid,
			};

			const res = await writeUserData(this.env, payload);
			return { ok: res.ok };
		});

		return {
			workflowId: event.instanceId,
			originalQuery: userQuery,
			finalAnswer,
			graph: graphResult.mermaid,
			graphWarnings: graphResult.warnings,
			graphSource: graphResult.source,
			stored: store,
		};
	}
}
