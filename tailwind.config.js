/**  @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-primary': '#121212',
        'dark-secondary': '#1e1e1e',
        'dark-tertiary': '#2d2d2d',
        'accent-primary': '#6366f1',
        'accent-secondary': '#4f46e5',
      }
    },
  },
  plugins: [],
};
 