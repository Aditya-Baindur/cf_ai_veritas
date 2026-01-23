// getId.ts
import { getWorkflowIds } from '../memory/workflowId';
import type { Env } from '../env';

type WorkflowPrefix = 's' | 'n' | 'r' | 'dev';

function extractNumericId(id: string): number | null {
	// Matches: s-12, n-12, x-12, 12
	const match = id.match(/(\d+)$/);
	if (!match) return null;
	return Number(match[1]);
}

export default async function getId(env: Env, prefix: WorkflowPrefix): Promise<string> {
	const idList = await getWorkflowIds(env);

	let maxId = 200;

	for (const rawId of idList) {
		const numeric = extractNumericId(rawId);
		if (numeric !== null && numeric > maxId) {
			maxId = numeric;
		}
	}

	const nextId = maxId + 1;
	return `${prefix}-${nextId}`;
}
