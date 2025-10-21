<template>
  <Layout>
    <router-view />
  </Layout>
</template>

<script setup>
import Layout from './components/Layout.vue';
import { onMounted } from 'vue';
import { useThemeStore } from './stores/theme';
import { useUserStore } from './stores/user';
import { supabase } from './api/supabase';
import { getCurrentUser } from './api/user';

const themeStore = useThemeStore();
const userStore = useUserStore();

async function fetchUser() {
  const { data } = await getCurrentUser();
  userStore.setUser(data?.user || null);
}

onMounted(() => {
  themeStore.initTheme();
  fetchUser();
  // 監聽登入狀態變化
  // supabase.auth.onAuthStateChange((_event, session) => {
  //   console.log('監聽登入狀態變化 changed');
  //   userStore.setUser(session?.user || null);
  // });
});
</script>

<style>
/* Add global styles here if needed */
</style>
