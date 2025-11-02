<template>
  <header class="w-full px-4 left-0 right-0 fixed z-10 top-0 lg:px-10 bg-background-light dark:bg-background-dark shadow-sm shadow-primary-light dark:shadow-primary-dark h-20 ">
    <div class=" container mx-auto flex flex-row justify-between items-center h-full relative">
      <a href="/" class="flex flex-row items-center ">
        <img :src="mandarinIcon" class="w-7 h-7 mr-3 lg:mr-4" />
        <span class="title">擇個<span class="title text-primary-light dark:text-primary-dark">吉</span>日</span>
      </a>
      <!-- Mobile menu button -->
       <div class="relative  ">
      <button class="lg:hidden w-fit " @click="menuOpen = !menuOpen" aria-label="Open menu">
        <font-awesome-icon :icon="['fa', menuOpen ? 'xmark' : 'bars']" class="w-6 h-6 text-primary-light dark:text-primary-dark" />
      </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

import { useThemeStore } from '@/stores/theme';
import Popup from './Popup.vue';
import { supabase } from '@/api/supabase';
import { getCurrentUser, signOut } from '@/api/user';
import { storeToRefs } from 'pinia';
import { toast } from 'vue3-toastify';
import mandarinIcon from '@/assets/images/mandarin.png';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

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
