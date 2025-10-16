module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#3b82f6", // blue-500
          dark: "#60a5fa", // blue-400
        },
        accent: {
          light: "#f59e42", // orange-400
          dark: "#fbbf24", // yellow-400
        },
        card: {
          light: "#fff",
          dark: "#1e293b", // slate-800
        },
        heading: {
          light: "#ef4444", // red-500
          dark: "#f472b6", // pink-400
        },
        input: {
          light: "#f3f4f6", // gray-100
          dark: "#334155", // slate-700
        },
      },
      borderRadius: {
        xl: "1rem",
      },
      fontFamily: {},
    },
  },
  plugins: [],
};
