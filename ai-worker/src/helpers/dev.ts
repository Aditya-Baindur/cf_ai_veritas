import { Env } from '../env';
import getId from './makeId';
import { assertDevParams } from '../workflow/types/params';

export async function routeDevWorkflow(env: Env, userMessage: string, clerkId: string) {
	const rawParams = {
		message: userMessage,
		clerkId,
	};

	const id = await getId(env, 'dev');
	console.log(id);

	assertDevParams(rawParams);

	const instance = await env.dev_workflow.create({
		id,
		params: rawParams,
	});

	return {
		id: instance.id,
		status: 200,
		payload: await instance.payload,
	};
}
