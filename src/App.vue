<template>
  <Layout>
    <router-view />
  </Layout>
</template>

<script>
import Layout from './components/Layout.vue';
export default {
  name: 'App',
  components: { Layout },
};
</script>

<style>
/* Add global styles here if needed */
</style>
