import type { Workflow } from 'cloudflare:workers';

export interface Env {
	// Workers AI
	AI: {
		run: (model: string, input: any) => Promise<any>;
	};

	// Workflows
	search_workflow: Workflow;
	reasoning_workflow: Workflow;
	normal_workflow: Workflow;
	dev_workflow: Workflow;
	MY_WORKFLOW: Workflow;

	// Google Custom Search
	GOOGLE_API_KEY: string;
	GOOGLE_CX: string;

	// Brave API for searching
	BRAVE_API_KEY: string;

	//Workflow Secret for push pull
	INTERNAL_WEBHOOK_SECRET: string;

	db: D1Database;
}
