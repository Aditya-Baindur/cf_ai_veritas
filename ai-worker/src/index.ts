import { Env } from './env';
import { getUserData } from './memory/helpers';

import { routeAiWorkflow } from './helpers/runlogic';
import { routeDevWorkflow } from './helpers/dev';

export * from './workflow';

import { buildGraphNeverFail } from './workflow/dev/graph/failsafe-build-graph';
import { CF_PRODUCTS } from './workflow/dev/graph/failsafe-build-graph';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// Health check
		if (url.pathname === '/health' && request.method === 'GET') {
			return Response.json(
				{
					name: 'Health Check',
					ok: true,
					status: 200,
				},
				{ status: 200 },
			);
		}
		// For internal USE only. it tells you the status of a specific instance.
		if (url.pathname === '/data/status' && request.method === 'GET') {
			try {
				let instance = await env.search_workflow.get('1001');
				return Response.json({
					id: instance.id,
					details: await instance.status(),
				});
			} catch (e: any) {
				// Handle errors
				// .get will throw an exception if the ID doesn't exist or is invalid.
				const msg = `failed to get instance 1001: ${e.message}`;
				console.error(msg);
				return Response.json({ error: msg }, { status: 400 });
			}
		}

		/* 
			Data bus URL's
		*/

		if (url.pathname === '/data/get') {
			const clerkId = request.headers.get('id');
			const dataGetAuthKey = request.headers.get('k');

			// Basic Auth to prevent anyone from getting any user's data
			if (!dataGetAuthKey) {
				return Response.json('No key. DENIED', { status: 403 });
			}
			if (dataGetAuthKey !== env.INTERNAL_WEBHOOK_SECRET) {
				return Response.json('ACCESS DENIED', { status: 403 });
			}

			// ID key validation
			if (!clerkId) {
				return Response.json('No Clerk ID provided', { status: 400 });
			}

			return await getUserData(env, clerkId, false);
		}

		if (url.pathname === '/data/get/dev') {
			// Auth data is sent via headers: id, k
			const clerkId = request.headers.get('id');
			const dataGetAuthKey = request.headers.get('k');

			// Basic Auth to prevent anyone from getting any user's data
			if (!dataGetAuthKey) {
				return Response.json('No key. DENIED', { status: 403 });
			}
			if (dataGetAuthKey !== env.INTERNAL_WEBHOOK_SECRET) {
				return Response.json('ACCESS DENIED', { status: 403 });
			}

			// ID key validation
			if (!clerkId) {
				return Response.json('No Clerk ID provided', { status: 400 });
			}

			return await getUserData(env, clerkId, true);
		}

		if (url.pathname === '/data/send' && request.method === 'POST') {
			// Validate internal secret
			const internalKey = request.headers.get('k');
			const type = request.headers.get('type');

			console.log(`TYPE : ${type ?? 'NO TYPE HEADER GOTTEN'}`);

			if (!internalKey) {
				return Response.json('Missing key', { status: 401 });
			}

			if (internalKey !== env.INTERNAL_WEBHOOK_SECRET) {
				return Response.json('ACCESS DENIED', { status: 403 });
			}

			// Parse body
			let body: { msg?: string; clerkUserId?: string };

			try {
				body = await request.json();
			} catch {
				return Response.json('Invalid JSON body', { status: 400 });
			}

			const { msg, clerkUserId } = body;

			// Validate payload
			if (!msg || typeof msg !== 'string') {
				return Response.json('Missing or invalid msg', { status: 400 });
			}

			if (!clerkUserId || typeof clerkUserId !== 'string') {
				return Response.json('Missing or invalid clerkUserId', { status: 400 });
			}

			if (type === 'dev') {
				const data = await routeDevWorkflow(env, msg, clerkUserId);
				return Response.json(data, { status: data.status });
			} else {
				const data = await routeAiWorkflow(env, msg, clerkUserId);
				return Response.json(data, { status: data.status });
			}
		}

		/**
		 * Temporary function to check if frontend works
		 */
		if (url.pathname === '/data/get/graph' && request.method === 'GET') {
			const GRAPH_TMP = `graph TD
  User -->|Request| Worker
  Worker --> D1[(D1)]
  Worker --> KV[(KV)]
  Worker --> AI[Workers AI]
  AI --> Worker
`;

			const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

			await sleep(2000);

			return Response.json(
				{
					graph: GRAPH_TMP,
				},
				{ status: 200 },
			);
		}

		if (url.pathname === '/bg/test' && request.method == 'GET') {
			const e = {
				env,
				explanation: `**System Architecture:**


1. **Cloudflare R2**: Stores and serves media and documents (images, videos, PDFs, etc.)
2. **Cloudflare Images**: Optimizes and caches images
3. **Cloudflare Stream**: Streams video and audio content
4. **Cloudflare Workers**: Provides custom logic and edge computing
5. **Cloudflare Cache**: Caches and reduces latency for media and documents


**Benefits:**


1. **Faster Load Times**
2. **Cost-Effective**
3. **Scalability**
4. **Security**


**CDN Comparison:**


| **Component** | **CDN with D1** | **CDN with R2** |
| --- | --- | --- |
| **Origin Server** | Cloudflare D1 | Cloudflare R2 |
| **Caching** | Cloudflare Cache | Cloudflare Cache |
| **Content Delivery** | Cloudflare CDN | Cloudflare CDN |
| **Edge Computing** | Cloudflare Workers | Cloudflare Workers |
| **Image Optimization** | Cloudflare Images | Cloudflare Images |
| **Video Streaming** | Cloudflare Stream | Cloudflare Stream |


**Key Differences:**


| **Feature** | **CDN with D1** | **`,
				cfProdLst: JSON.stringify(CF_PRODUCTS),
			};
			const res = await buildGraphNeverFail(e);

			return Response.json(res);
		}

		// Fallback
		return new Response('Not Found', { status: 404 });
	},
};
