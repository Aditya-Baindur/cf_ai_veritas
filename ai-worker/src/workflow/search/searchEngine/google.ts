import type { Env } from '../../../env';

export async function googleSearch(
	query: string,
	env: Env,
): Promise<{
	query: string;
	results: {
		title: string;
		url: string;
		snippet?: string;
	}[];
}> {
	if (!query) throw new Error('Missing query');

	const url = new URL('https://www.googleapis.com/customsearch/v1');
	url.searchParams.set('key', env.GOOGLE_API_KEY);
	url.searchParams.set('cx', env.GOOGLE_CX);
	url.searchParams.set('q', `site:cloudflare.com ${query}`);
	url.searchParams.set('num', '5');

	const res = await fetch(url.toString());
	if (!res.ok) throw new Error(`Google failed: ${res.status}`);

	const data: any = await res.json();

	return {
		query,
		results:
			data.items?.map((i: any) => ({
				title: i.title,
				url: i.link,
				snippet: i.snippet,
			})) ?? [],
	};
}
