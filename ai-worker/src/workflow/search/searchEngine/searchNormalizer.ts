import { UnifiedSearchResult } from '../../types/normalizedResults';
import { duckDuckGoSearch } from '../searchEngine/duckduckgo';
import { googleSearch } from '../searchEngine/google';
import { BraveNormalizedResult } from '../searchEngine/brave';

export function normalizeDDG(data: Awaited<ReturnType<typeof duckDuckGoSearch>>): UnifiedSearchResult[] {
	return data.results.map((r, i) => ({
		title: r.title,
		url: r.url,
		source: 'duckduckgo',
		description: r.description,
		rawPosition: i,
	}));
}

export function normalizeGoogle(data: Awaited<ReturnType<typeof googleSearch>>): UnifiedSearchResult[] {
	return data.results.map((r, i) => ({
		title: r.title,
		url: r.url,
		source: 'google',
		description: r.snippet,
		snippet: r.snippet,
		rawPosition: i,
	}));
}

export function normalizeBrave(data: BraveNormalizedResult[]): UnifiedSearchResult[] {
	return data.map((r) => ({
		title: r.title,
		url: r.url,
		source: 'brave',
		description: r.description,
		fullDomain: r.fullDomain,
		thumbnail: r.thumbnail,
		sitelinks: r.sitelinks,
		rawPosition: r.rawPosition,
	}));
}
