/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#19A7CE",
        secondary: "#146C94",
        third: "#AFD3E2",
        background: "white",
        neutral: "#B5B5B5",
        success: "#4CAF50",
        error: "#F44336",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0%" },
          "100%": { opacity: "100%" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-in-out",
      },
    },
  },

  darkMode: "class",
  plugins: [],
};
