/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mboa: {
          green: '#1B5E20',
          yellow: '#F9A825',
          red: '#C62828',
          earth: '#5D4037',
          sky: '#0288D1',
          night: '#0D1B2A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
