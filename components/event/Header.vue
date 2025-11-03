<template>
  <div
    class="h-20 w-full px-4 left-0 right-0 fixed z-10 top-0 lg:px-10 bg-background-light dark:bg-background-dark shadow-sm shadow-primary-light dark:shadow-primary-dark"
  >
    <div
      class="container mx-auto flex flex-row justify-between items-center h-full relative"
    >
      <a href="/" class="flex flex-row items-center">
        <img :src="mandarinIcon" class="w-7 h-7 mr-3 lg:mr-4" :draggable="false" />
        <span class="pickdate_title"
          >擇個<span class="pickdate_title text-primary-light dark:text-primary-dark"
            >吉</span
          >日</span
        >
      </a>

      <div class="relative" ref="menuRef">
        <button
          v-if="props.currentUser"
          class="flex flex-row items-center gap-2"
          @click="menuOpen = !menuOpen"
        >
          <img :src="avatarSrc" class="w-8 h-8 rounded-full border-2 border-primary-light" />
          <span>{{ props.currentUser.username }}</span>
          <font-awesome-icon
            :icon="['fas', 'chevron-down']"
            class="w-3 h-3" />
        </button>
        <button
          v-else
          class="btn enter_btn"
          @click="() => props.setShowChooseUser(true)"
        >
          加入
        </button>
        <div
          v-if="menuOpen"
          class="absolute top-0 right-0 mt-12 w-36 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-20"
        >
          <div class="flex flex-col">
            <!-- <button
            class="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="handleMenuItemClick(toggleDarkMode)"
          >
            切換{{ isDark ? '淺色' : '深色' }}模式
          </button> -->
            <button
              class="px-4 py-2 text-center hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="handleMenuItemClick(props.cleanUser)"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";

import { useThemeStore } from "~/stores/theme";
import { storeToRefs } from "pinia";
import mandarinIcon from "~/assets/images/mandarin.png";
import { avatarIconList } from "~/assets/images/avatar/index.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const themeStore = useThemeStore();

const props = defineProps({
  currentUser: {
    type: Object,
    default: null,
  },
  cleanUser: {
    type: Function,
    default: null,
  },
  setShowChooseUser: {
    type: Function,
    default: null,
  },
});
const menuOpen = ref(false);
const menuRef = ref(null);

const avatarSrc = computed(() => {
  return props.currentUser
    ? avatarIconList.find((item) => item.name === props.currentUser.avatar_name)
        ?.src ?? ""
    : "";
});

// 點擊外部關閉選單
function handleClickOutside(event) {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    menuOpen.value = false;
  }
}

// 點擊選單項目後關閉選單
function handleMenuItemClick(callback) {
  if (callback) {
    callback();
  }
  menuOpen.value = false;
}

function toggleDarkMode() {
  themeStore.toggleDark();
}

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside);
  }
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleClickOutside);
  }
});

</script>

<style scoped>

</style>
