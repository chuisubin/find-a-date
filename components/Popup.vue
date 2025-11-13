<template>
  <div v-if="visible"
  :class="isCentered?' justify-center':'justify-start   py-5 lg:py-10'"
  class="fixed inset-0 z-50 bg-black/40 dark:bg-white/10 transition-all   max-h-screen  overflow-auto  flex flex-col   " @mousedown.self="handleClickOutside">
    <div class="mx-auto w-fit bg-background-light dark:bg-background-dark rounded  max-w-full min-w-[300px] relative lg:w-auto   ">
      
      <div class="flex flex-row justify-end pt-2 lg:pt-4 px-2 lg:px-5" v-if="props.showClose">
      <button
        
        @click="close"
        class="  rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-100 text-3xl w-10 h-10 flex items-center justify-center  focus:outline-none "
        aria-label="Close popup"
      >
        &times;
      </button></div>
      <div class="pb-4 px-4 md:pb-8 md:px-8 lg:pb-10  lg:px-10 mx-auto"  :class="props.showClose?'lg:pt-2 ':'pt-4 lg:pt-10'" >
      <slot />
      </div>
     
      <!-- <div class="h-80 bg-red-50"></div> -->
    </div>
     <!-- <div  class="min-h-20 w-full relative TODO" /> -->
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  showClose: { type: Boolean, default: true },
  enableClickOutside: { type: Boolean, default: true },
  isCentered: { type: Boolean, default: true },
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

watch(visible, (newVal) => {
  if (!newVal) {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  } else {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }
});
</script>
