<template>
  <div class="max-w-xl mx-auto py-8 px-4">
    <h2 class="text-xl font-bold mb-4">Event Detail</h2>
    <div v-if="loading" class="text-gray-400">Loading...</div>
    <div v-else-if="event">
      <div class="card p-4 mb-4">
        <div class="font-semibold text-lg mb-2">{{ event.title }}</div>
        <div class="text-xs text-gray-400 mb-2">ID: {{ event.id }}</div>
        <div class="text-gray-600">Owner: {{ event.owner_id }}</div>
        <div class="text-gray-600 mt-2">Members: <span v-if="event.members && event.members.length">{{ event.members.join(', ') }}</span><span v-else>None</span></div>
      </div>
    </div>
    <div v-else class="text-red-500">Event not found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEventById } from '../api/event';

const route = useRoute();
const event = ref(null);
const loading = ref(true);

async function fetchEvent() {
  loading.value = true;
  try {
    event.value = await fetchEventById(route.params.id);
  } catch (e) {
    event.value = null;
  }
  loading.value = false;
}

onMounted(() => {
  fetchEvent();
});
</script>
