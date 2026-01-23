// memory/read.ts
import { Env } from '../env';

export async function getStore(env: Env, clerkUserId: string, dev: boolean): Promise<Response> {
	const baseQuery = `
    SELECT
      original_query,
      final_answer,
      graph
    FROM chat_logs
    WHERE user_clerk_id = ?
  `;

	const stmt = dev
		? env.db
				.prepare(
					baseQuery +
						`
            AND workflow_id LIKE 'dev-%'
            ORDER BY created_at ASC
          `,
				)
				.bind(clerkUserId)
		: env.db
				.prepare(
					baseQuery +
						`
            AND (workflow_id NOT LIKE 'dev-%' OR workflow_id IS NULL)
            ORDER BY created_at ASC
          `,
				)
				.bind(clerkUserId);

	const result = await stmt.all();

	const messages = result.results.map((row: any) => ({
		user: row.original_query,
		assistant: row.final_answer,
		graph: row.graph ?? null,
	}));

	return new Response(JSON.stringify(messages), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
