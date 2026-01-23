// search.ts

type SearchResult = {
	title: string;
	snippet: string;
	url: string;
};

export function mergeResults(bing: SearchResult[], ddg: SearchResult[]): SearchResult[] {
	const seen = new Set<string>();
	const merged: SearchResult[] = [];

	for (const r of [...bing, ...ddg]) {
		if (!seen.has(r.url)) {
			seen.add(r.url);
			merged.push(r);
		}
	}

	return merged;
}
