/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#020208',
          cyan: '#00f0ff',
          magenta: '#ff003c',
          yellow: '#fcee0a',
          light: '#e0e0e0',
          dark: '#0a0a10',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"Share Tech Mono"', '"Source Code Pro"', 'monospace'],
        display: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['clamp(3.5rem, 12vw, 10rem)', { lineHeight: '0.8', letterSpacing: '-0.06em' }],
        'display-md': ['clamp(2rem, 8vw, 6rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        'body-lg': ['clamp(1rem, 2vw, 1.25rem)', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
      }
    },
  },
  plugins: [],
}
