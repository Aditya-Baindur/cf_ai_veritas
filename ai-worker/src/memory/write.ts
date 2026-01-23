/* 

This file is the storage object - Am using a simple D1 SQL Database 
The Schema is in D1.sql in src/memory/schema

*/

import type { Env } from '../env';
import { WriteStoreInput } from '../workflow/types/writeDB';

export async function writeStore(env: Env, data: WriteStoreInput): Promise<void> {
	await env.db
		.prepare(
			`
    INSERT INTO chat_logs (
      user_clerk_id,
      workflow_id,
      original_query,
      refined_query,
      final_url,
      final_answer,
      graph
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
		)
		.bind(
			data.clerkUserId,
			data.workflowId,
			data.originalQuery,
			data.refinedQuery ?? null,
			data.finalUrl ?? null,
			data.finalAnswer,
			data.graph ?? null,
		)
		.run();
}
