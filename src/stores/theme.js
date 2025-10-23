import { defineStore } from "pinia";
import { ref, onMounted, onUnmounted } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(false);
  const windowWidth = ref(window.innerWidth);

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

  function updateWindowWidth() {
    windowWidth.value = window.innerWidth;
  }

  onMounted(() => {
    window.addEventListener("resize", updateWindowWidth);
  });
  onUnmounted(() => {
    window.removeEventListener("resize", updateWindowWidth);
  });

  return {
    isDark,
    setDark,
    toggleDark,
    initTheme,
    windowWidth,
    updateWindowWidth,
  };
});
