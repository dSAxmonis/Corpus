/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF8',
        ink: '#171717',
        line: '#E4E4E0',
        accent: '#2E5BFF',
        muted: '#8A8A85',
        // Dark dashboard tokens
        surface: '#0a0a0f',
        'surface-elevated': '#12121a',
        'surface-card': '#16161f',
        'surface-hover': '#1e1e2a',
        'border-subtle': 'rgba(255,255,255,0.06)',
        'border-glow': 'rgba(139,92,246,0.25)',
        'text-primary': '#f0f0f5',
        'text-secondary': '#71717a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        content: '1120px',
      },
      keyframes: {
        'corpus-spin': {
          to: { transform: 'rotate(360deg)' },
        },
        'ai-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'corpus-spin': 'corpus-spin 2.2s linear infinite',
        'ai-pulse': 'ai-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
