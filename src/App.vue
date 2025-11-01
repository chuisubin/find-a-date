<template>
  <Layout>
    <router-view />
  </Layout>
</template>

<script setup>
import Layout from './components/Layout.vue';
import { onMounted } from 'vue';
import { useThemeStore } from './stores/theme';

const themeStore = useThemeStore();


onMounted(() => {
  themeStore.initTheme();

});
</script>

<style>
/* Add global styles here if needed */
</style>
