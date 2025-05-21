/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        source: ['"Source Sans 3"', "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        teal: {
          50: "#DFF4F6",
          100: "#BFEAEE",
          200: "#7AD3DB",
          300: "#3ABECA",
          400: "#258089",
          500: "#134347",
          600: "#0F3538",
          700: "#0C2A2C",
          800: "#081A1C",
          900: "#040F10",
          950: "#020808",
        },
      },
    },
  },
  plugins: [],
};
