/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F6F43',
          hover: '#175934',
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#1F6F43',
          600: '#175934',
          700: '#15803d',
        },
        secondary: {
          DEFAULT: '#2E6F9E',
          hover: '#23577d',
        },
        success: '#2E8B57',
        warning: '#D98E04',
        danger: '#C0392B',
        neutral: {
          900: '#1A1A1A',
          600: '#5C5C5C',
          300: '#D4D4D4',
          100: '#F5F5F4',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1E1E1E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
