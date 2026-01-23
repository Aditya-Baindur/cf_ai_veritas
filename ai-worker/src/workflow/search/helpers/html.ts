export async function getHtml(url: string): Promise<string | null> {
	const res = await fetch(url, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (compatible; SearchAgent/1.0)',
			Accept: 'text/html',
		},
	});

	if (!res.ok) return null;

	return await res.text();
}

export function cleanHtml(html: string): string {
	return (
		html
			/* ----------------------------------------
			   REMOVE NON-CONTENT SECTIONS (STRUCTURAL)
			   ---------------------------------------- */

			// Header / footer / nav / aside
			.replace(/<header[\s\S]*?<\/header>/gi, '')
			.replace(/<footer[\s\S]*?<\/footer>/gi, '')
			.replace(/<nav[\s\S]*?<\/nav>/gi, '')
			.replace(/<aside[\s\S]*?<\/aside>/gi, '')

			// Common layout / junk containers
			.replace(/<div[^>]+role=["']?navigation["']?[\s\S]*?<\/div>/gi, '')
			.replace(/<div[^>]+aria-label=["']?(navigation|footer|menu)["']?[\s\S]*?<\/div>/gi, '')
			.replace(/<div[^>]+class=["'][^"']*(nav|menu|footer|header|cookie|consent|banner)[^"']*["'][\s\S]*?<\/div>/gi, '')

			/* ----------------------------------------
			   REMOVE SCRIPTS / STYLES / COMMENTS
			   ---------------------------------------- */

			.replace(/<script[\s\S]*?<\/script>/gi, '')
			.replace(/<style[\s\S]*?<\/style>/gi, '')
			.replace(/<!--[\s\S]*?-->/g, '')

			/* ----------------------------------------
			   OPTIONAL: TRY TO KEEP <main> IF PRESENT
			   ---------------------------------------- */

			// If <main> exists, prefer its content
			.replace(/^[\s\S]*?<main[^>]*>/i, '<main>')
			.replace(/<\/main>[\s\S]*$/i, '</main>')

			/* ----------------------------------------
			   STRIP ALL REMAINING TAGS
			   ---------------------------------------- */

			.replace(/<\/?[^>]+>/g, ' ')

			/* ----------------------------------------
			   DECODE BASIC ENTITIES
			   ---------------------------------------- */

			.replace(/&nbsp;/g, ' ')
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')

			/* ----------------------------------------
			   NORMALIZE WHITESPACE
			   ---------------------------------------- */

			.replace(/\s+/g, ' ')
			.trim()

			/* ----------------------------------------
			   HARD SAFETY LIMIT
			   ---------------------------------------- */

			.slice(0, 40_000)
	);
}

export function estimateTokens(text: string): number {
	return Math.ceil(text.length / 4);
}
