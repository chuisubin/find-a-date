<template>
  <header class="px-4 sticky z-10 top-0 lg:px-10 bg-background-light dark:bg-background-dark shadow-sm shadow-primary-light dark:shadow-primary-dark">
    <div class="container mx-auto flex flex-row justify-between items-center h-20 relative">
      <a href="/" class="flex flex-row items-center text-2xl lg:text-3xl font-bold">
        <img :src="mandarinIcon" class="w-7 h-7 mr-3 lg:mr-4" />
        <span>擇個<span class="text-primary-light dark:text-primary-dark">吉</span>日</span>
      </a>
      <!-- Mobile menu button -->
      <button class="lg:hidden ml-2 w-fit" @click="menuOpen = !menuOpen" aria-label="Open menu">
        <font-awesome-icon :icon="['fa', menuOpen ? 'xmark' : 'bars']" class="w-6 h-6 text-primary-light dark:text-primary-dark" />
      </button>
      <!-- Navigation -->
  <nav :class="['flex items-center', 'lg:flex', menuOpen ? 'flex flex-col fixed left-0 right-0 top-20 bottom-0 w-full h-[calc(100vh-5rem)] bg-background-light dark:bg-background-dark shadow-lg p-4 z-50' : 'hidden lg:flex']">
        <div v-if="user" class="flex flex-col lg:flex-row lg:items-center w-full lg:w-auto">
          <span class="lg:ml-4 font-semibold mb-2 lg:mb-0">{{ user.user_metadata?.username || user.email }}</span>
          <button
            @click="handleLogout"
            class="lg:ml-4 normal_btn mb-2 lg:mb-0"
          >
            登出
          </button>
        </div>
        <div v-else class="flex flex-col lg:flex-row lg:items-center w-full lg:w-auto">
          <button
            @click="userStore.openAuthPopup()"
            class="normal_btn lg:ml-4 mb-2 lg:mb-0"
          >
            登入
          </button>
          <Popup v-model="showAuthPopup" :enableClickOutside="true">
            <AuthPopup @close="userStore.closeAuthPopup()" @auth-success="onAuthSuccess" />
          </Popup>
        </div>
        <button
          @click="toggleDarkMode"
          class="w-full lg:w-auto lg:ml-4 normal_btn"
          aria-label="Toggle dark mode"
        >
          <span v-if="isDark">🌙</span>
          <span v-else>☀️</span>
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

import { useThemeStore } from '@/stores/theme';
import { useUserStore } from '@/stores/user';
import AuthPopup from './auth/AuthPopup.vue';
import Popup from './Popup.vue';
import { supabase } from '@/api/supabase';
import { getCurrentUser, signOut } from '@/api/user';
import { storeToRefs } from 'pinia';
import { toast } from 'vue3-toastify';
import mandarinIcon from '@/assets/images/mandarin.png';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const userStore = useUserStore();
const { user, showAuthPopup } = storeToRefs(userStore);
const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);
const menuOpen = ref(false);

function toggleDarkMode() {
  themeStore.toggleDark();
}

async function fetchUser() {
  const { data } = await getCurrentUser();
  userStore.setUser(data?.user || null);
}
const onAuthSuccess = async () => {
  await fetchUser();
  userStore.closeAuthPopup();
};

async function handleLogout() {
  await signOut();
  userStore.clearUser();
  toast.success('Logout successful!');
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
@media (max-width: 768px) {
  header {
    height: auto !important;
  }

  nav {
    width: 100%;
    margin-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
}
</style>
