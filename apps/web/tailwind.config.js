const {heroui} = require("@heroui/theme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            50: "#fdf4ff",
            100: "#fae8ff", 
            200: "#f5d0fe",
            300: "#f0abfc",
            400: "#e879f9",
            500: "#d946ef",
            600: "#c026d3",
            700: "#a21caf",
            800: "#86198f",
            900: "#701a75",
            DEFAULT: "#d946ef",
            foreground: "#ffffff",
          }
        }
      },
      dark: {
        colors: {
          primary: {
            50: "#fdf4ff",
            100: "#fae8ff",
            200: "#f5d0fe", 
            300: "#f0abfc",
            400: "#e879f9",
            500: "#d946ef",
            600: "#c026d3",
            700: "#a21caf",
            800: "#86198f",
            900: "#701a75",
            DEFAULT: "#d946ef",
            foreground: "#ffffff",
          }
        }
      }
    }
  })],
}
