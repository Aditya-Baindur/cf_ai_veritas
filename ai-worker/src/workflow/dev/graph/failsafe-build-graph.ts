// graph/failsafe-build-graph.ts
import type { Env } from '../../../env';
import { handleLlamaJson, llamaToString } from '../../../model/llama';
import { graphJsonPrompt } from './graph-json-prompt';
import { repairGraphPrompt } from './repairGraphPrompt';

/* ----------------------------------------
   Types
---------------------------------------- */

export type MermaidDirection = 'LR' | 'RL' | 'TB' | 'BT';

export const CF_PRODUCTS = [
	'User',
	'CDN',
	'Workers',
	'Workflows',
	'D1',
	'KV',
	'R2',
	'Queues',
	'DurableObjects',
	'WorkersAI',
	'Pages',
	'Access',
] as const;

export type CFProduct = (typeof CF_PRODUCTS)[number];

export type MermaidNode = {
	id: string;
	label: string;
	product: CFProduct;
};

export type MermaidEdge = {
	from: string;
	to: string;
	label?: string;
};

export type MermaidGraph = {
	direction: MermaidDirection;
	nodes: MermaidNode[];
	edges: MermaidEdge[];
};

export type BuildGraphResult = {
	graph: MermaidGraph;
	mermaid: string;
	warnings: string[];
	source: 'llm' | 'repaired' | 'fallback';
	debugRaw: string; // 🔥 ALWAYS RETURN RAW OUTPUT (BETA)
};

/* ----------------------------------------
   Explicit ERROR graph (no lying)
---------------------------------------- */

function errorGraph(reason: string): MermaidGraph {
	return {
		direction: 'LR',
		nodes: [{ id: 'error', label: `ERROR: ${reason}`, product: 'CDN' }],
		edges: [],
	};
}

/* ----------------------------------------
   Sentinel-based JSON extraction
---------------------------------------- */

function tryExtractJsonObject(text: string): string | null {
	// Case 1: BEGIN + END (ideal)
	const full = text.match(/###BEGIN_JSON###([\s\S]*?)###END_JSON###/);
	if (full) {
		const payload = full[1].trim();
		return payload === 'INVALID_JSON' ? null : payload;
	}

	// Case 2: BEGIN only (model finished cleanly)
	const beginIdx = text.indexOf('###BEGIN_JSON###');
	if (beginIdx !== -1) {
		const afterBegin = text.slice(beginIdx + '###BEGIN_JSON###'.length);

		// take everything up to last closing brace
		const lastBrace = afterBegin.lastIndexOf('}');
		if (lastBrace !== -1) {
			return afterBegin.slice(0, lastBrace + 1).trim();
		}
	}

	return null;
}

/* ----------------------------------------
   Main: validate-json → parse → repair → error
---------------------------------------- */

export async function buildGraphNeverFail(args: { env: Env; explanation: string; cfProdLst: string }): Promise<BuildGraphResult> {
	const warnings: string[] = [];

	try {
		// ===============================
		// LLM #2 — JSON GENERATION
		// ===============================
		const raw = await handleLlamaJson(
			graphJsonPrompt(args.explanation),
			`
${args.cfProdLst}

OUTPUT FORMAT ENFORCER:
- OUTPUT JSON ONLY BETWEEN SENTINELS
- IF YOU FAIL, OUTPUT INVALID_JSON
`,
			args.env,
		);

		const rawText = llamaToString(raw) ?? '';

		// 🔥🔥🔥 CRITICAL DEBUG LOG 🔥🔥🔥
		console.log('========== GRAPH JSON LLM RAW OUTPUT START ==========');
		console.log(rawText);
		console.log('========== GRAPH JSON LLM RAW OUTPUT END ==========');

		// ===============================
		// Extract JSON
		// ===============================
		const extracted = tryExtractJsonObject(rawText);
		if (!extracted) {
			warnings.push('No JSON object found in model output.');
			const g = errorGraph('No JSON object found in model output');

			return {
				graph: g,
				mermaid: jsonToMermaid(g),
				warnings,
				source: 'fallback',
				debugRaw: rawText,
			};
		}

		// ===============================
		// Parse JSON
		// ===============================
		let parsed: any;
		try {
			parsed = JSON.parse(extracted);
		} catch (err) {
			warnings.push(`Initial JSON.parse failed: ${String(err)}`);

			// ===============================
			// REPAIR STEP (LLM #3)
			// ===============================
			const repair = await handleLlamaJson(repairGraphPrompt(extracted, String(err)), 'OUTPUT JSON ONLY', args.env);

			const repairedText = llamaToString(repair) ?? '';

			console.log('====== GRAPH JSON REPAIR RAW OUTPUT START ======');
			console.log(repairedText);
			console.log('====== GRAPH JSON REPAIR RAW OUTPUT END ======');

			const repairedExtracted = tryExtractJsonObject(`###BEGIN_JSON###${repairedText}###END_JSON###`);

			if (!repairedExtracted) {
				const g = errorGraph('Repair failed: no JSON returned');
				return {
					graph: g,
					mermaid: jsonToMermaid(g),
					warnings,
					source: 'fallback',
					debugRaw: rawText,
				};
			}

			try {
				parsed = JSON.parse(repairedExtracted);
			} catch (err2) {
				const g = errorGraph(`Repair JSON.parse failed: ${String(err2)}`);
				return {
					graph: g,
					mermaid: jsonToMermaid(g),
					warnings,
					source: 'fallback',
					debugRaw: rawText,
				};
			}

			warnings.push('Graph JSON repaired successfully');
		}

		// ===============================
		// NORMALIZE + MERMAID
		// ===============================
		const graph: MermaidGraph = {
			direction: parsed.direction ?? 'LR',
			nodes: parsed.nodes ?? [],
			edges: parsed.edges ?? [],
		};

		return {
			graph,
			mermaid: jsonToMermaid(graph),
			warnings,
			source: warnings.length ? 'repaired' : 'llm',
			debugRaw: rawText,
		};
	} catch (err) {
		const g = errorGraph(`Hard failure: ${String(err)}`);
		return {
			graph: g,
			mermaid: jsonToMermaid(g),
			warnings: [String(err)],
			source: 'fallback',
			debugRaw: '',
		};
	}
}

/* ----------------------------------------
   Mermaid rendering
---------------------------------------- */

function escapeMermaidLabel(text: string): string {
	return text.replace(/"/g, '\\"').replace(/\n/g, ' ');
}

function jsonToMermaid(graph: MermaidGraph): string {
	const lines: string[] = [];
	lines.push(`flowchart ${graph.direction}`);

	for (const node of graph.nodes) {
		lines.push(`${node.id}["${escapeMermaidLabel(node.label)}<br/><sub>${node.product}</sub>"]`);
	}

	for (const edge of graph.edges) {
		if (edge.label) {
			lines.push(`${edge.from} -->|${edge.label}| ${edge.to}`);
		} else {
			lines.push(`${edge.from} --> ${edge.to}`);
		}
	}

	return lines.join('\n');
}
