<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main class="flex-1 container mx-auto px-4 py-8">
      <slot />
    </main>
    <footer class="bg-gray-200 text-center py-4 mt-auto">
      <span class="text-gray-600">&copy; 2025 Find a Date</span>
    </footer>
  </div>
</template>

<script>
import Header from './Header.vue';
export default {
  name: 'Layout',
  components: { Header },
};
</script>
