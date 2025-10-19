<template>
  <header class="bg-blue-600 text-white py-4 shadow dark:bg-gray-900 dark:text-gray-100">
    <div class="container mx-auto flex justify-between items-center px-4">
        <a href="/" class=" hover:underline text-2xl font-bold">Find a Date</a>
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
            @click="showAuth = true"
            class="ml-4 px-4 py-1 rounded bg-white text-blue-600 dark:bg-gray-800 dark:text-blue-300 border border-blue-300 dark:border-blue-600 font-semibold shadow hover:bg-blue-50 dark:hover:bg-gray-700 transition"
          >
            Login / Register
          </button>
          <Popup v-model="showAuth" :enableClickOutside="true">
            <AuthPopup @close="showAuth = false" @auth-success="onAuthSuccess" />
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
import { storeToRefs } from 'pinia';
import Popup from './Popup.vue';
import AuthPopup from './AuthPopup.vue';
import { getCurrentUser, signOut,  } from '../api/user';
import {supabase} from '../api/supabase';
import { useUserStore } from '../stores/user';


const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const isDark = ref(false);
const showAuth = ref(false);

function updateHtmlClass() {
  const html = document.documentElement;
  if (isDark.value) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

function toggleDarkMode() {
  isDark.value = !isDark.value;
  updateHtmlClass();
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
}

const onAuthSuccess = () => {
  showAuth.value = false;
  fetchUser();
};
async function fetchUser() {
  const { data } = await getCurrentUser();
  userStore.setUser(data?.user || null);
}

async function handleLogout() {
  await signOut();
  userStore.clearUser();
}



onMounted(() => {
  const theme = localStorage.getItem('theme');
  isDark.value = theme === 'dark';
  updateHtmlClass();
  fetchUser();
  // 監聽登入狀態變化
  supabase.auth.onAuthStateChange((_event, session) => {
    userStore.setUser(session?.user || null);
  });
});
</script>
