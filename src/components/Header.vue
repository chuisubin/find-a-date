<template>
  <header
    class="w-full px-4 left-0 right-0 fixed z-10 top-0 lg:px-10 bg-background-light dark:bg-background-dark shadow-sm shadow-primary-light dark:shadow-primary-dark h-20"
  >
    <div
      class="container mx-auto flex flex-row justify-between items-center h-full relative"
    >
      <a href="/" class="flex flex-row items-center">
        <img :src="mandarinIcon" class="w-7 h-7 mr-3 lg:mr-4" />
        <span class="title"
          >擇個<span class="title text-primary-light dark:text-primary-dark"
            >吉</span
          >日</span
        >
      </a>

      <div class="relative">
        <button
          v-if="props.currentUser"
          class="flex flex-row items-center gap-2"
          @click="menuOpen = !menuOpen"
        >
          <img :src="avatarSrc" class="w-8 h-8 rounded-full" />
          <span>{{ props.currentUser.username }}</span>
        </button>
        <div
          v-if="menuOpen"
          class="absolute top-0 right-0 mt-12 w-48 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-20"
        >
          <div class="flex flex-col">
            <!-- <button
            class="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="toggleDarkMode"
          >
            切換{{ isDark ? '淺色' : '深色' }}模式
          </button> -->
            <button
              class="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="props.cleanUser"
            >
              切換用戶
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";

import { useThemeStore } from "@/stores/theme";
import Popup from "./Popup.vue";
import { supabase } from "@/api/supabase";
import { getCurrentUser, signOut } from "@/api/user";
import { storeToRefs } from "pinia";
import { toast } from "vue3-toastify";
import mandarinIcon from "@/assets/images/mandarin.png";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { avatarIconList } from "@/assets/images/avatar/index.js";
const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);

const props = defineProps({
  currentUser: {
    type: Object,
    default: null,
  },
  cleanUser: {
    type: Function,
    default: null,
  },
});
const menuOpen = ref(false);

const avatarSrc = computed(() => {
  return props.currentUser
    ? avatarIconList.find((item) => item.name === props.currentUser.avatar_name)
        ?.src ?? ""
    : "";
});



function toggleDarkMode() {
  themeStore.toggleDark();
}

</script>

<style scoped>
.title {
  @apply text-2xl lg:text-3xl font-bold;
}
</style>
