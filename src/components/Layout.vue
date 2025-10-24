<template>
  <div class="min-h-screen  bg-background-light  dark:bg-background-dark text-text-light  dark:text-text-dark">
    <Header />
    <main class="flex-1 container mx-auto px-4 py-8">
      <slot />
    </main>
    <!-- <footer class="bg-gray-200 dark:bg-gray-700 text-center py-4 mt-auto">
      <span class="text-gray-600 dark:text-gray-300">&copy; 2025 Find a Date</span>
    </footer> -->
  </div>
</template>

<script setup>
import Header from './Header.vue';
</script>


