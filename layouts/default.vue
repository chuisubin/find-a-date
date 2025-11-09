<template>
  <div
    class="min-h-screen relative bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
  >
    <main class="px-4 lg:px-10">
      <div class="container mx-auto py-8 relative min-h-[calc(100vh-6.25rem)]">
        <slot />
      </div>
    </main>
    <footer
      class="min-h-[6.25rem] flex flex-col  justify-center  bg-gray-200 dark:bg-gray-700 text-center mt-auto text-gray-600 dark:text-gray-300"
    >
      <p>Made with ❤️ - <a
          href="https://forms.gle/DsLENsXdWQbQoCnN6"
          target="_blank"
          class="text-primary-light hover:underline"
        >
          分享您的意見
        </a></p>
      <p class="">&copy; 2025 Angus Chui | 個人作品</p>
    </footer>
  </div>
</template>

<script setup></script>
