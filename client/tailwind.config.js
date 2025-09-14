/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monochrome Charm Color Palette
        'dark-bg-primary': '#050505',
        'dark-bg-secondary': '#1A1A1A',
        'brand-teal': '#1B9AAA',
        'light-text-primary': '#FFFFFF',
        'light-text-secondary': '#DDDBBCB',
        'dark-border': '#333333',
        'state-success': '#28A745',
        'state-danger': '#DC3545',
        'state-warning': '#FFC107',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
