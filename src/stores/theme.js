import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(false);

  function setDark(val) {
    isDark.value = val;
    const html = document.documentElement;
    if (val) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("theme", val ? "dark" : "light");
  }

  function toggleDark() {
    setDark(!isDark.value);
  }

  function initTheme() {
    const theme = localStorage.getItem("theme");
    setDark(theme === "dark");
  }

  return {
    isDark,
    setDark,
    toggleDark,
    initTheme,
  };
});
