import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from 'cloudflare:workers';
import type { Env } from '../../env';

import { handleLlama, llamaToString } from '../../model/llama';
import { writeUserData, getUserData } from '../../memory/helpers';
import { truncateHistoryByTokens } from '../search/helpers/history';

import type { WriteStoreInput } from '../types/writeDB';
import type { ReasoningParams } from '../types/params';

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

export class ReasoningWorkflow extends WorkflowEntrypoint<Env, ReasoningParams> {
	async run(event: WorkflowEvent<ReasoningParams>, step: WorkflowStep) {
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
		   STEP 2 — Intent / task understanding
		---------------------------------------- */
		const intent = await step.do('understand-intent', async () => {
			const res = await handleLlama(
				userQuery,
				`
Classify the user's intent.

Return ONLY one of:
- explanation
- comparison
- troubleshooting
- opinion
- how_to
- factual
`,
				this.env,
			);

			const text = llamaToString(res);
			return text ?? 'factual';
		});

		/* ----------------------------------------
		   STEP 3 — Private reasoning (hidden)
		---------------------------------------- */
		const reasoningScratchpad = await step.do('internal-reasoning', async () => {
			const res = await handleLlama(
				`
User intent: ${intent}

Conversation context:
${history.text}

User question:
${userQuery}

Think step by step.
Decide:
- key assumptions
- missing info
- best approach

DO NOT answer the user.
DO NOT summarize.
`,
				'',
				this.env,
			);

			// May be null — that's OK
			return llamaToString(res);
		});

		/* ----------------------------------------
		   STEP 4 — Final answer (user-safe)
		---------------------------------------- */
		const finalAnswer = await step.do('final-answer', async () => {
			const res = await handleLlama(
				`
You are answering the user.

Context:
${history.text}

User question:
${userQuery}

Intent: ${intent}

Here is what you reasoned about: ${reasoningScratchpad ?? '[internal reasoning unavailable]'}
DO NOT SHOW ANY OF IT TO THE USER.

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
		   STEP 5 — Store (NO chain-of-thought)
		---------------------------------------- */
		const store = await step.do('store-result', async () => {
			const payload: WriteStoreInput = {
				clerkUserId: clerkId,
				workflowId: event.instanceId,
				originalQuery: userQuery,
				refinedQuery: intent,
				finalUrl: null,
				finalAnswer,
			};

			const res = await writeUserData(this.env, payload);
			return { ok: res.ok, status: res.status };
		});

		return {
			originalQuery: userQuery,
			intent,
			finalAnswer,
			// Returned only for internal workflow debugging — NOT persisted
			chainOfThought: reasoningScratchpad,
			stored: store.ok,
		};
	}
}
