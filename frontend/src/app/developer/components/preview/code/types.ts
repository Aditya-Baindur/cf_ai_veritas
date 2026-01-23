// ./types.ts

export type FileNode = {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  content?: string
  isOpen?: boolean
}

export const createInitialFileTree = (graph: string): FileNode[] => [
  {
    id: 'main',
    name: 'main.mermaid',
    type: 'file',
    content: graph,
  },
]
