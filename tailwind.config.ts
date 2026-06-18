import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // ink (text-on-dark scale)
        ink: {
          50:  '#fafaf9',
          100: '#f4f4f1',
          200: '#d8d6cf',
          300: '#a8a59c',
          400: '#7a7770',
          500: '#56544f',
          600: '#3a3935',
          700: '#26241f', // surface lifts
          800: '#1a1916', // card bg
          900: '#0f0e0c', // page bg
        },
        // amber accent
        amber: {
          200: '#fde6b3',
          400: '#f5a623',
          500: '#e88c00',
          600: '#c46f00',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
