/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          page: '#111413',
          sidebar: '#191C1B',
          chat: '#1D201F',
        },
        text: {
          primary: '#E1E3E0',
          secondary: '#C4C7C4',
        },
        bubble: {
          assistant: {
            bg: '#32363D',
            text: '#E1E3E0',
          },
          user: {
            bg: '#10A37F',
            text: '#FFFFFF',
          },
        },
        input: {
          bg: '#1D201F',
          text: '#E1E3E0',
          border: '#282A2E',
        },
        button: {
          primary: '#10A37F',
          hover: '#0E9673',
        },
        accent: '#10A37F',
        divider: '#272B29',
      },
      fontFamily: {
        sans: ['"OpenAI Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"SFMono-Regular"', 'Consolas', '"Liberation Mono"', 'Menlo', 'monospace'],
      },
      fontSize: {
        base: '16px',
        sm: '14px',
      },
      lineHeight: {
        normal: '1.5',
      },
      borderRadius: {
        'bubble': '8px',
        'input': '6px',
      },
      spacing: {
        'bubble': '8px',
        'input': '12px',
      },
      maxWidth: {
        'chat': '600px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}