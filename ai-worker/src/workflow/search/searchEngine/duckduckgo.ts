export async function duckDuckGoSearch(query: string): Promise<{
	query: string;
	results: {
		title: string;
		url: string;
		description?: string;
	}[];
}> {
	if (!query) throw new Error('Missing query');

	const url = new URL('https://api.duckduckgo.com/');
	url.searchParams.set('q', `site:cloudflare.com ${query}`);
	url.searchParams.set('format', 'json');
	url.searchParams.set('no_redirect', '1');
	url.searchParams.set('no_html', '1');

	const res = await fetch(url.toString());
	if (!res.ok) throw new Error(`DuckDuckGo failed: ${res.status}`);

	const data: any = await res.json();
	const results: any[] = [];

	if (data.AbstractURL) {
		results.push({
			title: data.Heading ?? 'DuckDuckGo',
			url: data.AbstractURL,
			description: data.AbstractText,
		});
	}

	if (Array.isArray(data.Results)) {
		for (const r of data.Results) {
			if (r.FirstURL) {
				results.push({
					title: r.Text ?? 'Result',
					url: r.FirstURL,
					description: r.Text,
				});
			}
		}
	}

	if (Array.isArray(data.RelatedTopics)) {
		for (const t of data.RelatedTopics) {
			if (t.FirstURL) {
				results.push({
					title: t.Text ?? 'Related',
					url: t.FirstURL,
					description: t.Text,
				});
			}
			if (Array.isArray(t.Topics)) {
				for (const sub of t.Topics) {
					if (sub.FirstURL) {
						results.push({
							title: sub.Text ?? 'Related',
							url: sub.FirstURL,
							description: sub.Text,
						});
					}
				}
			}
		}
	}

	return { query, results };
}
