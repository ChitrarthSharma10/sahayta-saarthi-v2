/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coursue: {
          bg: '#F6F7FB',
          surface: '#FFFFFF',
          purple: {
            DEFAULT: '#755BE8',
            hover: '#6448DE',
            light: '#EEE9FB',
            subtle: '#F4F0FD',
          },
          text: {
            DEFAULT: '#19191F',
            secondary: '#92929E',
            muted: '#A5A5B2',
          },
          border: '#EEEEF4',
          pink: {
            DEFAULT: '#FDE8EF',
            text: '#E8437D',
          },
          cyan: {
            DEFAULT: '#E7F7F8',
            text: '#0EA5E9',
          }
        },
        canvas: '#121316',
        surface: {
          DEFAULT: '#1c1d22',
          light: '#25262c',
          card: '#18191e',
          border: '#2a2c35'
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.02)',
        'soft': '0 8px 30px rgba(117, 91, 232, 0.08)',
      }
    },
  },
  plugins: [],
}
