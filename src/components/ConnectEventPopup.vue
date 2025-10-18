<template>
  <Popup v-model="show" @close="close">
    <template #default>
      <div class="p-4">
        <h3 class="text-lg font-bold mb-2">Connect Event</h3>
        <form @submit.prevent="handleConnectEvent">
          <div class="mb-2">
            <label class="block mb-1">Event Code / Link</label>
            <input v-model="eventCode" type="text" class="input w-full" placeholder="Enter event code or link" required />
          </div>
          <div class="flex justify-center gap-2 mt-4">
            <button type="button" class="btn cancel_btn" @click="close">Cancel</button>
            <button type="submit" class="enter_btn btn">Connect</button>
          </div>
        </form>
      </div>
    </template>
  </Popup>
</template>

<script setup>
import { ref, watch,  } from 'vue';
import Popup from '../components/Popup.vue';

const props = defineProps({
  modelValue: Boolean
});
const emit = defineEmits(['update:modelValue', 'connected']);

const show = ref(props.modelValue);
const eventCode = ref("");

watch(() => props.modelValue, (val) => {
  show.value = val;
});
watch(show, (val) => {
  emit('update:modelValue', val);
});

function close() {
  show.value = false;
}

async function handleConnectEvent() {
  if (!eventCode.value.trim()) return;
  // TODO: connect event logic
  emit('connected', eventCode.value);
  show.value = false;
  eventCode.value = "";
}
</script>
