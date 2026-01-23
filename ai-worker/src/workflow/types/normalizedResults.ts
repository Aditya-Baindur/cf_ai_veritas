export type UnifiedSearchResult = {
	// Core
	title: string;
	url: string;
	source: 'duckduckgo' | 'google' | 'brave';

	// Text grounding
	description?: string;
	snippet?: string;

	// Domain
	fullDomain?: string;

	// Media
	thumbnail?: {
		url: string;
		width?: number;
		height?: number;
	};

	// Context
	sitelinks?: {
		title: string;
		url: string;
	}[];

	// Debug
	rawPosition?: number;
};
