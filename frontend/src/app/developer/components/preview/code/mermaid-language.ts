import type * as Monaco from 'monaco-editor'

export function registerMermaidLanguage(monaco: typeof Monaco) {
  // Prevent double registration
  if (monaco.languages.getLanguages().some((l) => l.id === 'mermaid')) return

  monaco.languages.register({
    id: 'mermaid',
    extensions: ['.mmd', '.mermaid'],
    aliases: ['Mermaid'],
  })

  monaco.languages.setMonarchTokensProvider('mermaid', {
    tokenizer: {
      root: [
        [
          /^\s*(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram)\b/,
          'keyword',
        ],

        [/\b(subgraph|end|direction|linkStyle|classDef)\b/, 'keyword'],

        [/-->|---|\-\.\->|\<\-\->|\-\->/, 'operator'],

        [/\[.*?\]|\(.*?\)|\{.*?\}/, 'type'],

        [/"[^"]*"/, 'string'],

        [/\b[A-Za-z0-9_]+\b/, 'identifier'],
      ],
    },
  })
}
