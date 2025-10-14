/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Prompt', 'sans-serif'],
        'prompt': ['Prompt', 'sans-serif'],
        'display': ['Prompt', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

