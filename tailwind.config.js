/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#16a34a',
        farmer: '#16a34a',
        labour: '#d97706',
        provider: '#2563eb',
      },
    },
  },
  plugins: [],
}
