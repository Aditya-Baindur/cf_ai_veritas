// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        terminal: 'var(--terminal)',
        'terminal-foreground': 'var(--terminal-foreground)',
        'terminal-header': 'var(--terminal-header)',
        'terminal-widget': 'var(--terminal-widget)',
        'terminal-border': 'var(--terminal-border)',
        'terminal-muted': 'var(--terminal-muted)',
        'terminal-accent': 'var(--terminal-accent)',
        'terminal-success': 'var(--terminal-success)',
        'terminal-danger': 'var(--terminal-danger)',

        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'accent-hover': 'var(--accent-hover)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
    },
  },
  plugins: [],
}

export default config
