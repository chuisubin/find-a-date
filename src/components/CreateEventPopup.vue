<template>
  <Popup v-model="show" @close="close">
    <template #default>
      <div class="p-4">
        <h3 class="text-lg font-bold mb-2">Create Event</h3>
        <form @submit.prevent="handleCreateEvent">
         
          <div class="mb-2">
            <label class="block mb-1">Title</label>
            <input v-model="newEventTitle" type="text" class="input w-full" required />
          </div>
          <div class="mb-2">
            <label class="block mb-1">Description</label>
            <textarea v-model="newEventDescription" class="input w-full" rows="3" placeholder="Enter event description..."></textarea>
          </div>
          <div class="mb-2">
            <label class="block mb-1">Deadline (days)</label>
            <input v-model.number="newEventDeadlineDays" type="number" min="1" class="input w-full" required />
          </div>
          <div class="mb-2">
            <label class="block mb-1">Enable Date Range</label>
            <DatePicker v-model:value="enableDateRange" type="date"  format="YYYY-MM-DD"  :disabled-date="disableBeforeToday"	 range value-type="date"  class="w-full" input-class="input w-full" required />
          </div>
          <div class="flex justify-center gap-2 mt-4">
            <button type="button" class="btn cancel_btn" @click="close">Cancel</button>
            <button type="submit" class="enter_btn btn">Create</button>
          </div>
        </form>
      </div>
    </template>
  </Popup>
</template>

<script setup>
const today = new Date();
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import { formatDateLocal } from '../utils/dateFormat.js';
const enableDateRange = ref([]);
import { ref, watch, defineEmits } from 'vue';
import Popup from '../components/Popup.vue';
import { createEvent } from '../api/event';
import { useUserStore } from '../stores/user';

const props = defineProps({
  modelValue: Boolean
});
const emit = defineEmits(['update:modelValue', 'created']);

const show = ref(props.modelValue);
const newEventTitle = ref("");
const newEventDescription = ref("");
const newEventDeadlineDays = ref(1);
const userStore = useUserStore();

watch(() => props.modelValue, (val) => {
  show.value = val;
});
watch(show, (val) => {
  emit('update:modelValue', val);
});

function close() {
  show.value = false;
}

async function handleCreateEvent() {
  if (!newEventTitle.value.trim() || !newEventDeadlineDays.value || newEventDeadlineDays.value < 1) return;
  if (!enableDateRange.value || enableDateRange.value.length !== 2) {
    alert('Please select a valid date range.');
    return;
  }
  let [startDate, endDate] = enableDateRange.value;
  // 格式化為 YYYY-MM-DD
  const startDateFormatted = formatDateLocal(startDate);
const endDateFormatted = formatDateLocal(endDate);
  
    console.log('startDate, endDate', startDateFormatted, endDateFormatted);

  const now = new Date();
  now.setDate(now.getDate() + newEventDeadlineDays.value);
  const deadlineDate = now.toISOString().slice(0, 10);
  try {
    await createEvent({
      title: newEventTitle.value,
      description: newEventDescription.value,
      owner_id: userStore.user.id,
      deadline_date: deadlineDate,
      enable_start_date: startDate,
      enable_end_date: endDate,
    });
    show.value = false;
    newEventTitle.value = "";
    newEventDescription.value = "";
    newEventDeadlineDays.value = 1;
    enableDateRange.value = [];
    emit('created');
  } catch (e) {
    alert('Failed to create event');
  }
}

function disableBeforeToday(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

</script>
