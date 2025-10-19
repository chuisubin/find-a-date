import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  // AuthPopup 控制
  const showAuthPopup = ref(false);
  function openAuthPopup() {
    showAuthPopup.value = true;
  }
  function closeAuthPopup() {
    showAuthPopup.value = false;
  }
  function setUser(u) {
    user.value = u;
  }
  function clearUser() {
    user.value = null;
  }
  return {
    user,
    setUser,
    clearUser,
    showAuthPopup,
    openAuthPopup,
    closeAuthPopup,
  };
});
