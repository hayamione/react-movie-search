/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#f59e0b',
        },
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.4), 0 4px 12px -2px rgb(0 0 0 / 0.35)',
        raised: '0 2px 4px 0 rgb(0 0 0 / 0.4), 0 12px 28px -4px rgb(0 0 0 / 0.45)',
        overlay: '0 4px 8px 0 rgb(0 0 0 / 0.45), 0 24px 48px -8px rgb(0 0 0 / 0.55)',
      },
      transitionDuration: {
        fast: '150ms',
        smooth: '300ms',
        slow: '500ms',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
