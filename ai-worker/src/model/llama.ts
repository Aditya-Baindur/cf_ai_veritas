import type { Env } from '../env';

export async function handleLlama(userMessage: string, systemPrompt: string, env: Env) {
	return env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: userMessage },
		],
		max_tokens: 2048,
		temperature: 0,
	});
}

export async function handleLlamaJson(userMessage: string, systemPrompt: string, env: Env) {
	return env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: userMessage },
		],

		max_tokens: 2048,
		temperature: 0,

		stop: ['###END_JSON###'],
	});
}

/**
 * STRICT extractor:
 * - returns null for empty / whitespace responses
 * - never throws
 */
export function llamaToString(llamaResponse: unknown): string | null {
	if (!llamaResponse) return null;

	let text: string | null = null;

	if (typeof llamaResponse === 'string') {
		text = llamaResponse;
	} else if (typeof llamaResponse === 'object' && llamaResponse !== null) {
		const r = llamaResponse as any;

		text =
			r.result?.response ??
			r.result?.messages?.find((m: any) => m.role === 'assistant')?.content ??
			r.response ??
			r.output_text ??
			r.text ??
			null;
	}

	if (!text) return null;

	const trimmed = String(text).trim();
	return trimmed.length > 0 ? trimmed : null;
}
