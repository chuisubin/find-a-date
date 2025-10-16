<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" @mousedown.self="handleClickOutside">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-10 min-w-[300px] relative">
      <button
        v-if="showClose"
        @click="close"
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 text-3xl w-10 h-10 flex items-center justify-center rounded-full focus:outline-none  focus:ring-blue-400"
        aria-label="Close popup"
      >
        &times;
      </button>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  showClose: { type: Boolean, default: true },
  enableClickOutside: { type: Boolean, default: true },
});
const emit = defineEmits(['update:modelValue', 'close']);

const visible = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  visible.value = val;
});

function close() {
  visible.value = false;
  emit('update:modelValue', false);
  emit('close');
}

function handleClickOutside(e) {
  if (props.enableClickOutside) {
    close();
  }
}

// Optional: ESC key to close
function onKeydown(e) {
  if (e.key === 'Escape' && visible.value) {
    close();
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>
