import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export const runtime = 'edge'

export default function SignInPage() {
  return (
    <div className="relative flex h-dvh items-center justify-center overflow-hidden bg-terminal font-mono text-terminal-foreground">
      {/* terminal grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* auth container */}
      <div className="relative z-10 w-full max-w-md rounded-lg border border-terminal-border bg-terminal-widget p-6">
        {/* <div className="mb-6 text-center">
          <p className="text-terminal-muted">{"> Antares Terminal"}</p>
          <p className="mt-1 text-xs text-terminal-muted/80">
            Secure Market Intelligence Console
          </p>
        </div> */}

        <SignIn
          appearance={{
            elements: {
              /* ---------- GLOBAL CARD SPACING ---------- */
              card: 'space-y-8 bg-transparent p-10 shadow-none border-0',

              /* ---------- HEADER ---------- */
              header: 'space-y-3',
              headerTitle: 'text-terminal-foreground font-mono text-xl',
              headerSubtitle: 'text-terminal-muted font-mono text-xs',

              /* ---------- FORM STACK ---------- */
              form: 'space-y-6',

              /* Each input block (label + input) */
              formFieldRow: 'space-y-5',
              formField: 'space-y-2',

              formFieldLabel: 'text-terminal-muted text-xs font-mono pl-7',

              formFieldInput:
                'w-[85%] mx-auto px-3 py-2 bg-transparent border border-terminal-border text-terminal-foreground placeholder:text-terminal-muted font-mono rounded-sm focus:ring-1 focus:ring-terminal-accent focus:border-terminal-accent',

              /* ---------- DIVIDER ---------- */
              divider: 'my-6 flex items-center justify-center gap-4',
              dividerLine: 'w-[40%] bg-terminal-border opacity-40',
              dividerText:
                'text-terminal-muted text-[10px] tracking-widest bg-terminal-widget px-2',

              /* ---------- PRIMARY BUTTON ---------- */
              formButtonPrimary:
                'w-[85%] mx-auto mt-4 py-2 font-mono bg-terminal-foreground text-terminal rounded-sm tracking-wide hover:opacity-90 transition',

              /* ---------- SOCIAL LOGIN ---------- */
              socialButtons: 'space-y-4',
              socialButtonsBlockButton:
                'w-[85%] mx-auto border border-terminal-border text-terminal-foreground bg-transparent font-mono text-sm rounded-md flex items-center gap-3 hover:bg-terminal-header transition',

              socialButtonsProviderIcon: 'mx-1',

              socialButtonsProviderIcon__github: 'invert brightness-10',

              /* ---------- FOOTER (HIDDEN) ---------- */
              footer: 'hidden',
              footerAction: 'hidden',
              footerActionText: 'hidden',
              footerActionLink: 'hidden',
              footerPages: 'hidden',
            },
          }}
        />

        <div className="flex justify-center">
          <Link
            href="/sign-up"
            className="mt-4 w-[85%] rounded-sm border border-terminal-border py-2 pt-2 text-center font-mono text-xs tracking-widest text-terminal-muted transition hover:border-terminal-accent hover:text-terminal-foreground"
          >
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  )
}
