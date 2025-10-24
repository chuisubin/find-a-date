module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#ff7a00",
          dark: "#ff9e4d",
        },
        error: {
          light: "#ff3b30", // iOS error red
          dark: "#ff6f61", // softer error red for dark mode
          bg: "#fff0f0", // error background
          border: "#ffb3b3", // error border
          text: "#b91c1c", // error text
        },
        "background-light": "#fcfcfc",
        "background-dark": "#121212",
        "card-dark": "#1e1e1e",
        "text-light": "#111418",
        "text-dark": "#f6f7f8",
        "text-secondary-light": "#617589",
        "text-secondary-dark": "#a0b3c4",
      },
      fontFamily: {
        display: ["Work Sans", "Noto Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px",
      },
      plugins: [],
    },
  },
};
