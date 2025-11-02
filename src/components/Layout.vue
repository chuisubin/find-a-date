<template>
  <div class="min-h-screen  relative bg-background-light  dark:bg-background-dark text-text-light  dark:text-text-dark">
    <main class=" px-4  lg:px-10  ">
    <div class="container mx-auto py-8  relative min-h-screen ">
      <slot />
    </div>
    </main>
    <footer class="bg-gray-200 dark:bg-gray-700 text-center py-4 mt-auto text-gray-600 dark:text-gray-300">
      <p>Made with ❤️</p>
      <p class="">&copy;  2025 Angus Chui | 個人作品</p>
    </footer>
  </div>
</template>

<script setup>
import Header from './Header.vue';
</script>


