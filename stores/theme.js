import { defineStore } from "pinia";
import { ref, onMounted, onUnmounted } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(false);
  const windowWidth = ref(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  function setDark(val) {
    isDark.value = val;
    if (typeof document !== "undefined") {
      const html = document.documentElement;
      if (val) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("theme", val ? "dark" : "light");
    }
  }

  function toggleDark() {
    setDark(!isDark.value);
  }

  function initTheme() {
    if (typeof localStorage !== "undefined") {
      const theme = localStorage.getItem("theme");
      setDark(theme === "dark");
    }
  }

  function updateWindowWidth() {
    if (typeof window !== "undefined") {
      windowWidth.value = window.innerWidth;
    }
  }

  onMounted(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateWindowWidth);
    }
  });
  onUnmounted(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", updateWindowWidth);
    }
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
