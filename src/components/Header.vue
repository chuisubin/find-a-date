<template>
  <header class="bg-blue-600 text-white py-4 shadow dark:bg-gray-900 dark:text-gray-100">
    <div class="container mx-auto flex justify-between items-center px-4">
        <a href="/" class="  text-2xl font-bold">夾日期</a>
      <nav class="flex items-center">
        <div v-if="user">
          <span class="ml-4 font-semibold">{{ user.user_metadata?.username || user.email }}</span>
          <button
            @click="handleLogout"
            class="ml-4 px-4 py-1 rounded bg-white text-blue-600 dark:bg-gray-800 dark:text-blue-300 border border-blue-300 dark:border-blue-600 font-semibold shadow hover:bg-blue-50 dark:hover:bg-gray-700 transition"
          >
            Logout
          </button>
        </div>
        <div v-else>
          <button
            @click="userStore.openAuthPopup()"
            class="ml-4 px-4 py-1 rounded bg-white text-blue-600 dark:bg-gray-800 dark:text-blue-300 border border-blue-300 dark:border-blue-600 font-semibold shadow hover:bg-blue-50 dark:hover:bg-gray-700 transition"
          >
            Login / Register
          </button>
          <Popup v-model="showAuthPopup" :enableClickOutside="true">
            <AuthPopup @close="userStore.closeAuthPopup()" @auth-success="onAuthSuccess" />
          </Popup>
        </div>
        <button
          @click="toggleDarkMode"
          class="ml-6 px-3 py-1 rounded bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 transition"
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

import { ref, onMounted } from 'vue';
import { useThemeStore } from '../stores/theme';
import { useUserStore } from '../stores/user';
import AuthPopup from './AuthPopup.vue';
import Popup from './Popup.vue';
import { supabase } from '../api/supabase';
import { getCurrentUser, signOut } from '../api/user';
import { storeToRefs } from 'pinia';
import { toast } from 'vue3-toastify';


const userStore = useUserStore();
const { user, showAuthPopup } = storeToRefs(userStore);
const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);

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


</script>
