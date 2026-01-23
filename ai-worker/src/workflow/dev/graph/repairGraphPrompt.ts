// graph/repairGraphPrompt.ts
export function repairGraphPrompt(badJson: string, error: string) {
	return `
You are a JSON repair tool.

TASK:
- Fix the JSON below so it is VALID JSON
- Preserve ALL semantic meaning
- Do NOT add new nodes or edges
- Do NOT remove nodes or edges unless required for validity
- NO markdown
- OUTPUT JSON ONLY

ERROR:
${error}

BROKEN JSON:
${badJson}
`;
}
