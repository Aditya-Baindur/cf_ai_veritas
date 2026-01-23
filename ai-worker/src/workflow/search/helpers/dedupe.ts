import { UnifiedSearchResult } from '../../types/normalizedResults';

export function mergeAndDedupe(results: UnifiedSearchResult[]): UnifiedSearchResult[] {
	const map = new Map<string, UnifiedSearchResult>();

	for (const r of results) {
		const existing = map.get(r.url);
		if (!existing || (r.description && !existing.description) || (r.thumbnail && !existing.thumbnail)) {
			map.set(r.url, r);
		}
	}

	return [...map.values()];
}
