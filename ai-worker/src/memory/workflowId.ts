// workflow_id

/* 
    This is just to get all the workflow id's and generate new id's without collapsing 
*/

import type { Env } from '../env';

export async function getWorkflowIds(env: Env): Promise<string[]> {
	const res = await env.db.prepare(`SELECT workflow_id FROM chat_logs`).all();

	if (!res.results) return [];

	return res.results.map((r: any) => r.workflow_id).filter(Boolean);
}
