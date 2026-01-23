import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import type { Env } from '../../env';

import { handleLlama, llamaToString } from '../../model/llama';
import { writeUserData, getUserData } from '../../memory/helpers';
import { truncateHistoryByTokens } from '../search/helpers/history';

import type { WriteStoreInput } from '../types/writeDB';
import type { NormalParams } from '../types/params';

type ChatHistoryItem = {
	user: string;
	assistant: string;
};

function isChatHistoryArray(data: unknown): data is ChatHistoryItem[] {
	return (
		Array.isArray(data) &&
		data.every(
			(item) =>
				typeof item === 'object' && item !== null && typeof (item as any).user === 'string' && typeof (item as any).assistant === 'string',
		)
	);
}

export class NormalWorkflow extends WorkflowEntrypoint<Env, NormalParams> {
	async run(event: WorkflowEvent<NormalParams>, step: WorkflowStep) {
		const userQuery = event.payload.message;
		const clerkId = event.payload.clerkId;

		/* ----------------------------------------
		   STEP 1 — Load recent conversation history
		---------------------------------------- */
		const history = await step.do('load-history', async () => {
			const res = await getUserData(this.env, clerkId, false);
			if (!res.ok) return { text: '', count: 0 };

			const json = await res.json();
			if (!isChatHistoryArray(json)) return { text: '', count: 0 };

			const { truncatedHistory, responseCount } = truncateHistoryByTokens(json, 800);

			return {
				count: responseCount,
				text: truncatedHistory.map((m) => `User: ${m.user}\nAssistant: ${m.assistant}`).join('\n'),
			};
		});

		/* ----------------------------------------
		   STEP 2 — Final answer (user-safe)
		---------------------------------------- */
		const finalAnswer = await step.do('final-answer', async () => {
			const res = await handleLlama(
				`
You are answering the user.

Context:
${history.text ?? 'This is the users first message'}

User question:
${userQuery}

Instructions:
- Use correct reasoning
- Be concise but complete
- DO NOT mention internal reasoning
- DO NOT mention analysis
`,
				'',
				this.env,
			);

			const text = llamaToString(res);

			return text ?? 'I’m sorry — I couldn’t generate a response for this request.';
		});

		/* ----------------------------------------
		   STEP 3 — Store 
		---------------------------------------- */
		const store = await step.do('store-result', async () => {
			const payload: WriteStoreInput = {
				clerkUserId: clerkId,
				workflowId: event.instanceId,
				originalQuery: userQuery,
				refinedQuery: null,
				finalUrl: null,
				finalAnswer,
			};

			const res = await writeUserData(this.env, payload);
			return { ok: res.ok, status: res.status };
		});

		return {
			workflowId: event.instanceId,
			originalQuery: userQuery,
			finalAnswer,
			stored: store.ok,
		};
	}
}
