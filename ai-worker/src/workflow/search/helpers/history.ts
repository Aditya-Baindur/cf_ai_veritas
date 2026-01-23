import { estimateTokens } from './html';

export function truncateHistoryByTokens(history: { user: string; assistant: string }[], maxTokens: number) {
	let totalTokens = 0;
	const selected: { user: string; assistant: string }[] = [];

	// walk from newest → oldest
	for (let i = history.length - 1; i >= 0; i--) {
		const block = `User: ${history[i].user}\nAssistant: ${history[i].assistant}\n`;

		const blockTokens = Number(estimateTokens(block));

		if (totalTokens + blockTokens > maxTokens) break;

		totalTokens += blockTokens;
		selected.push(history[i]);
	}

	// restore chronological order
	selected.reverse();

	return {
		truncatedHistory: selected,
		tokenCount: totalTokens,
		responseCount: selected.length,
	};
}
