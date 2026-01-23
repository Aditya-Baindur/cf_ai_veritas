import type { Env } from '../../../env';

export type BraveNormalizedResult = {
	title: string;
	url: string;
	description?: string;
	fullDomain?: string;
	thumbnail?: {
		url: string;
		width?: number;
		height?: number;
	};
	sitelinks?: {
		title: string;
		url: string;
	}[];
	rawPosition?: number;
};

export async function braveSearch(query: string, env: Env): Promise<BraveNormalizedResult[]> {
	if (!query) return [];

	const url = new URL('https://api.search.brave.com/res/v1/web/search');
	url.searchParams.set('q', `site:cloudflare.com ${query}`);
	url.searchParams.set('count', '10');
	url.searchParams.set('domains', 'cloudflare.com');

	const res = await fetch(url.toString(), {
		headers: {
			accept: 'application/json',
			'x-subscription-token': env.BRAVE_API_KEY,
		},
	});

	if (!res.ok) return [];

	const data: any = await res.json();
	if (!Array.isArray(data?.web?.results)) return [];

	return data.web.results.map((r: any, idx: number) => ({
		title: r.title,
		url: r.url,
		description: r.description,
		fullDomain: r.domain,
		thumbnail: r.thumbnail?.src
			? {
					url: r.thumbnail.src,
					width: r.thumbnail.width,
					height: r.thumbnail.height,
				}
			: undefined,
		sitelinks: r.links?.map((l: any) => ({
			title: l.title,
			url: l.url,
		})),
		rawPosition: idx,
	}));
}
