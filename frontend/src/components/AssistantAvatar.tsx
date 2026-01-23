import Image from 'next/image'

export function AssistantMapAvatar() {
  return (
    <div className="bg-terminal-foreground/90 relative h-20 w-10 rounded-md p-1 shadow-[0_0_12px_rgba(255,80,80,0.35)]">
      <Image
        src="/images/chat_logo.png"
        alt="AI Logo"
        width={300}
        height={300}
      />
    </div>
  )
}
