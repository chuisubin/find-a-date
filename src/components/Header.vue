<template>
  <header class=" px-4  lg:px-10 shadow-sm shadow-primary-light dark:shadow-primary-dark ">
    <div class="container mx-auto flex justify-between items-center  h-20 ">
        <a href="/" class="flex flex-row items-center  text-3xl font-bold   ">
          <img :src="mandarinIcon" class="w-7 h-7 mr-4"/>
          <span class="">擇個<span class="text-primary-light dark:text-primary-dark">吉</span>日</span></a>
      <nav class="flex items-center">
        <div v-if="user">
          <span class="ml-4 font-semibold">{{ user.user_metadata?.username || user.email }}</span>
          <button
            @click="handleLogout"
            class="ml-4 normal-btn  "
          >
            登出
          </button>
        </div>
        <div v-else>
          <button
            @click="userStore.openAuthPopup()"
            class="normal-btn ml-4 "
          >
            登入
          </button>
          <Popup v-model="showAuthPopup" :enableClickOutside="true">
            <AuthPopup @close="userStore.closeAuthPopup()" @auth-success="onAuthSuccess" />
          </Popup>
        </div>
        <button
          @click="toggleDarkMode"
          class="ml-4 normal-btn "
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
import { useThemeStore } from '@/stores/theme';
import { useUserStore } from '@/stores/user';
import AuthPopup from './auth/AuthPopup.vue';
import Popup from './Popup.vue';
import { supabase } from '@/api/supabase';
import { getCurrentUser, signOut } from '@/api/user';
import { storeToRefs } from 'pinia';
import { toast } from 'vue3-toastify';
import mandarinIcon from '@/assets/images/mandarin.png';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

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
