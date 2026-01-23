import { Env } from '../env';
import { WriteStoreInput } from '../workflow/types/writeDB';
import { getStore } from './read';
import { writeStore } from './write';

export async function getUserData(env: Env, clerkId: string, dev: boolean): Promise<Response> {
	let d = dev;
	return await getStore(env, clerkId, d);
}

export async function writeUserData(env: Env, usrData: WriteStoreInput): Promise<Response> {
	try {
		await writeStore(env, usrData);
	} catch (e) {
		return Response.json(`Failed, an error occoured : ${e} `, { status: 400 });
	}

	return Response.json('Sucess', { status: 200 });
}
