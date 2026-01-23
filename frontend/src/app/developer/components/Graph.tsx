import Mermaid from './Mermaid'

export type GraphProps = {
  graph: string
}

export default function Page({ graph }: GraphProps) {
  return (
    <div className="h-full w-full p-4">
      <Mermaid
        code={graph}
        filename="cloudflare-architecture.svg"
        className="flex h-screen flex-1 items-center justify-center"
      />
    </div>
  )
}
