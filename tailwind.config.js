/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 按照用户要求，增加薄荷绿主题色
        mint: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          900: '#14532d',
        }
      }
    },
  },
  plugins: [],
}
