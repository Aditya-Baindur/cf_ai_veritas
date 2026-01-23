import { classify, Intent } from '../workflow/classify';
import { Env } from '../env';
import getId from './makeId';
import { assertNormalParams, assertSearchParams, assertsReasoningParams } from '../workflow/types/params';

/**
 * Helper function to route AI to correct workflow
 * Intent = "normal" | "search" | "reasoning"
 */
export async function routeAiWorkflow(env: Env, userMessage: string, clerkId: string, cla?: Intent) {
	const rawParams = {
		message: userMessage,
		clerkId,
	};

	const intent: Intent = cla ?? (await classify(userMessage, env));

	console.log('[intent]', intent);

	switch (intent) {
		case 'normal': {
			const id = await getId(env, 'n');

			assertNormalParams(rawParams);

			const instance = await env.normal_workflow.create({
				id,
				params: rawParams,
			});

			return {
				id: instance.id,
				status: 200,
				payload: await instance.payload,
			};
		}

		case 'search': {
			const id = await getId(env, 's');

			assertSearchParams(rawParams);

			const instance = await env.search_workflow.create({
				id,
				params: rawParams,
			});

			return {
				id: instance.id,
				status: 200,
				payload: await instance.payload,
			};
		}

		case 'reasoning': {
			const id = await getId(env, 'r');

			assertsReasoningParams(rawParams);

			const instance = await env.reasoning_workflow.create({
				id,
				params: rawParams,
			});

			return {
				id: instance.id,
				status: 200,
				payload: await instance.payload,
			};
		}

		default:
			throw new Error(`Unknown intent: ${intent}`);
	}
}
