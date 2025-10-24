<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-white/10 transition-all" @mousedown.self="handleClickOutside">
    <div class="bg-background-light dark:bg-background-dark rounded   min-w-[300px] relative">
      
      <div class="flex flex-row justify-end pt-4 px-5" v-if="props.showClose">
      <button
        
        @click="close"
        class="  rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-100 text-3xl w-10 h-10 flex items-center justify-center  focus:outline-none "
        aria-label="Close popup"
      >
        &times;
      </button></div>
      <div class="pb-10 px-10"  :class="props.showClose?'pt-2 ':'pt-10'" >
      <slot />
      </div>
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
