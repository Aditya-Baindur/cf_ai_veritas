export function graphJsonPrompt(explanation: string) {
	return `
YOU ARE A JSON TRANSPILER.

YOU MUST FOLLOW THIS FORMAT EXACTLY.

###BEGIN_JSON###
{ JSON HERE }
###END_JSON###

RULES:
- NO text before BEGIN
- NO text after END
- NO markdown
- NO prose
- If you cannot comply, output:

###BEGIN_JSON###
INVALID_JSON
###END_JSON###

SCHEMA:
{
  "direction": "LR | RL | TB | BT",
  "nodes": [
    { "id": "string", "label": "string", "product": "User | CDN | Workers | Workflows | D1 | KV | R2 | Queues | DurableObjects | WorkersAI | Pages | Access" }
  ],
  "edges": [
    { "from": "string", "to": "string", "label": "string (optional)" }
  ]
}

INPUT:
${explanation}
`;
}
