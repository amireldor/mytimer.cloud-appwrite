/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#47A992",
        secondary: "#482121",
        third: "#7A3E3E",
        background: "#EEEEEE",
        neutral: "#B5B5B5",
        error: "#F44336",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
