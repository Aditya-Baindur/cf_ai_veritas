export type WriteStoreInput = {
	clerkUserId: string;
	workflowId: string;
	originalQuery: string;
	refinedQuery?: string | null;
	finalUrl?: string | null;
	finalAnswer: string;
	graph?: string | null;
};
