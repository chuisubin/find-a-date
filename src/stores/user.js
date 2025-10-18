import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  function setUser(u) {
    user.value = u;
  }
  function clearUser() {
    user.value = null;
  }
  return { user, setUser, clearUser };
});
