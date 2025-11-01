<template>
  <header class="px-4 sticky z-10 top-0 lg:px-10 bg-background-light dark:bg-background-dark shadow-sm shadow-primary-light dark:shadow-primary-dark h-20 ">
    <div class="container mx-auto flex flex-row justify-between items-center h-full relative">
      <a href="/" class="flex flex-row items-center ">
        <img :src="mandarinIcon" class="w-7 h-7 mr-3 lg:mr-4" />
        <span class="title">擇個<span class="title text-primary-light dark:text-primary-dark">吉</span>日</span>
      </a>
      <!-- Mobile menu button -->
       <div class="relative  ">
      <button class="lg:hidden w-fit " @click="menuOpen = !menuOpen" aria-label="Open menu">
        <font-awesome-icon :icon="['fa', menuOpen ? 'xmark' : 'bars']" class="w-6 h-6 text-primary-light dark:text-primary-dark" />
      </button>
      <!-- 小 MENU，僅在 menuOpen 時於 menu button 下方顯示（mobile）-->
      <div v-if="menuOpen" class="absolute  right-0 top-full mt-2 bg-background-light dark:bg-background-dark shadow-lg rounded-lg p-4 z-50 flex flex-col items-start lg:hidden">
        <div v-if="user" class="w-full mb-2">
          <span class="font-semibold mb-2 block">{{ user.user_metadata?.username || user.email }}</span>
          <button
            @click="handleLogout"
            class="normal_btn w-full mb-2"
          >
            登出
          </button>
        </div>
        <!-- <button
          @click="toggleDarkMode"
          class="normal_btn w-full"
          aria-label="Toggle dark mode"
        >
          <span v-if="isDark">🌙</span>
          <span v-else>☀️</span>
        </button> -->
      </div>
      </div>
      <!-- 桌面版 menu -->
      <nav class="hidden lg:flex items-center">
        <!-- <button
          @click="toggleDarkMode"
          class="lg:ml-4 normal_btn"
          aria-label="Toggle dark mode"
        >
          <span v-if="isDark">🌙</span>
          <span v-else>☀️</span>
        </button> -->
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

import { useThemeStore } from '@/stores/theme';
import { useUserStore } from '@/stores/user';
import Popup from './Popup.vue';
import { supabase } from '@/api/supabase';
import { getCurrentUser, signOut } from '@/api/user';
import { storeToRefs } from 'pinia';
import { toast } from 'vue3-toastify';
import mandarinIcon from '@/assets/images/mandarin.png';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const userStore = useUserStore();
const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);
const menuOpen = ref(false);

function toggleDarkMode() {
  themeStore.toggleDark();
}




watch(menuOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>


.title{
  @apply text-2xl lg:text-3xl font-bold;
}
</style>
