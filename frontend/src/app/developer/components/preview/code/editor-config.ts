'use client'

import { Monaco } from '@monaco-editor/react'
import { geistMono } from '../../../fonts'

export const defineMonacoThemes = (monaco: Monaco) => {
  monaco.editor.setTheme('vs', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'F38020', fontStyle: 'bold' },
      { token: 'string', foreground: 'E46E12' },
      { token: 'number', foreground: 'F38020' },
      { token: 'regexp', foreground: 'E46E12' },
      { token: 'type', foreground: 'F38020' },
      { token: 'class', foreground: 'F38020', fontStyle: 'bold' },
      { token: 'function', foreground: 'F38020' },
      { token: 'variable', foreground: '111111' },
      { token: 'operator', foreground: '111111' },
    ],
    colors: {
      'editor.foreground': '#111111',
      'editor.background': '#FFFFFF',
      'editor.selectionBackground': '#F38020',
      'editor.lineHighlightBackground': '#E5E7EB',
      'editorCursor.foreground': '#111111',
      'editorWhitespace.foreground': '#E5E7EB',
      'editorIndentGuide.background': '#E5E7EB',
    },
  })

  monaco.editor.defineTheme('servera-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'F38020' },
      { token: 'string', foreground: 'E46E12' },
      { token: 'number', foreground: 'F38020' },
      { token: 'regexp', foreground: 'E46E12' },
      { token: 'type', foreground: 'F38020' },
      { token: 'class', foreground: 'F38020' },
      { token: 'function', foreground: 'F38020' },
      { token: 'variable', foreground: '111111' },
      { token: 'operator', foreground: '111111' },
      { token: 'tag', foreground: 'F38020' },
      { token: 'tag.id', foreground: 'F38020' },
      { token: 'tag.class', foreground: 'F38020' },
      { token: 'delimiter', foreground: '111111' },
      { token: 'attribute.name', foreground: 'F38020' },
      { token: 'attribute.value', foreground: 'E46E12' },
      { token: 'text', foreground: '111111' },
    ],
    colors: {
      'editor.foreground': '#111111',
      'editor.background': '#FFFFFF',
      'editor.selectionBackground': '#F38020',
      'editor.lineHighlightBackground': '#E5E7EB',
      'editor.lineHighlightBorder': '#E5E7EB',
      'editorLineNumber.foreground': '#6B7280',
      'editorLineNumber.activeForeground': '#111111',
      'editorCursor.foreground': '#111111',
      'editorWhitespace.foreground': '#E5E7EB',
      'editorIndentGuide.background': '#E5E7EB',
    },
  })
}

// only syntax highlighting and line numbers
export const defaultEditorOptions = {
  readOnly: true,
  minimap: { enabled: false },
  fontSize: 13,
  fontFamily: `${geistMono.style.fontFamily}`,
  lineNumbers: 'on' as const,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on' as const,
  glyphMargin: false,
  renderLineHighlight: 'none' as const,
  // disable tooltips, hints, and suggestions
  quickSuggestions: false,
  suggestOnTriggerCharacters: false,
  acceptSuggestionOnCommitCharacter: false,
  acceptSuggestionOnEnter: 'off' as const,
  parameterHints: { enabled: false },
  hover: { enabled: false },
  inlayHints: { enabled: 'off' as const },
  // disable linting and validation features
  codeActionsOnSaveTimeout: 0,
  codeLens: false,
  contextmenu: false,
  colorDecorators: false,
  formatOnType: false,
  formatOnPaste: false,
  // disable semantic highlighting and code analysis
  semanticHighlighting: { enabled: false },
  occurrencesHighlight: 'off' as const,
  // disable all validation markers and squiggly lines
  matchBrackets: 'never' as const,
  wordBasedSuggestions: 'off' as const,
  selectionHighlight: false,
  renderFinalNewline: 'off' as const,
  // disable goto functionality
  gotoLocation: {
    multiple: 'goto' as const,
  },
  // disable warnings and error markers
  snippetSuggestions: 'none' as const,
  suggest: { filterGraceful: false, showWords: false },
  // explicitly disable validation for all languages
  'javascript.validate.enable': false,
  'typescript.validate.enable': false,
  'python.validate.enable': false,
  // disable error/warning squiggly lines
  'editor.semanticHighlighting.enabled': false,
  'editor.matchBrackets': 'never' as const,
  'editor.renderValidationDecorations': 'off' as const,
  'editor.folding': false,
  'editor.guides.indentation': false,
  'editor.renderWhitespace': 'none' as const,
  'editor.lightbulb.enabled': false,
  // disable validation
  validate: false,
  // disable language features but keep syntax highlighting
  renderControlCharacters: false,
  links: false,
  folding: false,
}
