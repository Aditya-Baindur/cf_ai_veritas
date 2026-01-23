export function normalizeUrl(raw: unknown): string | null {
	console.log(`raw : ${raw}`);
	if (typeof raw !== 'string') return null;

	let url = raw.trim();
	if (!url) return null;

	// Remove markdown artifacts
	url = url.replace(/^<|>$/g, '');

	// Fix missing protocol
	if (!/^https?:\/\//i.test(url)) {
		url = 'https://' + url;
	}

	try {
		const parsed = new URL(url);

		// Block non-http(s)
		if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
			return null;
		}

		// Strip hash fragments
		parsed.hash = '';

		return parsed.toString();
	} catch {
		return null;
	}
}
