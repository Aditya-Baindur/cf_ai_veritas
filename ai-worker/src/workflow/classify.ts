import { handleLlama, llamaToString } from '../model/llama';
import { Env } from '../env';

const INTENT_PROMPT = `
You are an intent classifier.

Your job is to classify the user's message into EXACTLY ONE of the following:

- normal:
  General conversation, greetings, explanations, summaries, coding tasks,
  refactoring, rewriting, definitions, or anything that can be answered
  using general knowledge WITHOUT live data or external lookup.

- search:
  ONLY if the request REQUIRES up-to-date, real-time, or factual information
  that could be wrong without performing an external search.
  Examples: current events, prices, weather, schedules, official docs, news.

- reasoning:
  Requests that require multi-step thinking, analysis, debugging, comparison,
  tradeoff evaluation, system design, or problem-solving.

IMPORTANT RULES:
- Definitions and explanations are NOT search.
- Coding, refactoring, summarizing, and rewriting are NOT search.
- Comparisons and "pros vs cons" are reasoning, NOT search.
- If unsure, prefer "normal" over "search".

Respond with JSON only in the form : 
{"intent":<your actual choice>}

Respond with JSON only, for example:
{"intent":"normal"}

`;

export type Intent = 'normal' | 'search' | 'reasoning';

export async function classify(userMessage: string, env: Env): Promise<Intent> {
	// Hard check if any of the words are inculded to catch most reasoning before AI
	const REASONING_HINT = /(why|debug|optimize|analyze|design|tradeoff|compare|pros and cons|how many|should I use|explain)/i;

	console.log('USER MESSAGE FROM INSIDE CLASSIFY');

	if (REASONING_HINT.test(userMessage)) {
		return 'reasoning';
	}

	const raw = await handleLlama(userMessage, INTENT_PROMPT, env);
	const text = llamaToString(raw);

	// if the AI fails, you return the base case of normal
	if (!text) {
		return 'normal';
	}

	let parsed: any;
	try {
		parsed = JSON.parse(text);
	} catch {
		console.error(`Classifier returned invalid JSON: ${text}`);
		return 'normal';
	}

	if (!parsed?.intent) {
		console.error(`Classifier missing intent field: ${text}`);
		return 'normal';
	}

	return parsed.intent as Intent;
}
