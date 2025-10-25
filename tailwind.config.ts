import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'zoom-dark': '#1f2937',
        'zoom-darker': '#111827',
        'zoom-blue': '#3b82f6',
        'zoom-red': '#ef4444',
      },
    },
  },
  plugins: [],
}

module.exports = config
