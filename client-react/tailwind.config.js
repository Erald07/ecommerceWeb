/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
    extend: {
      colors: {
        "primary": "#e72c6f",
        "secondary": "#789940e6",
      },
    },
    container: {
      center: true,
      screens: {
        lg: "1024px",
        xl: "1280px",
        "2xl": "1301px"
      },
    },
  },
  plugins: [],
}

