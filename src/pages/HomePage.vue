<template>
  <div class="max-w-xl mx-auto py-8 px-4">
    <template v-if="userStore.user">
      <div class="flex justify-center gap-4 mb-8">
        <button class="btn" @click="onCreateEvent">Create Event</button>
        <button class="btn" @click="onConnectEvent">Connect Event</button>
      </div>
      <CreateEventPopup v-model="showCreateEventPopup" @created="fetchMyEvents" />
      <h2 class="text-xl font-bold mb-2">My Events</h2>
      <ul>
        <li v-for="event in myEvents" :key="event.id" class="card mb-2 p-4 flex justify-between items-center">
          <span>{{ event.title }}</span>
          <span class="text-xs text-gray-400">{{ event.id }}</span>
        </li>
        <li v-if="myEvents.length === 0" class="text-gray-400 text-center py-8">No events found.</li>
      </ul>
    </template>
    <template v-else>
      <div class="text-center text-gray-500 py-16">
        Please login to create or view your events.
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, watch } from 'vue';
import { useUserStore } from '../stores/user';
import CreateEventPopup from '../components/CreateEventPopup.vue';
import { fetchUserEvents } from '../api/event';

const userStore = useUserStore();
const myEvents = ref([]);
const showCreateEventPopup = ref(false);
const fetching = ref(false);

async function fetchMyEvents() {
    if (fetching.value) return;
  if (!userStore.user) {
    myEvents.value = [];
    return;
  }
    try {
        console.log('fetchMyEvents', userStore.user.id);
        fetching.value = true;
    myEvents.value = await fetchUserEvents(userStore.user.id) || [];
  
  } catch (e) {
    myEvents.value = [];
  } finally {
    fetching.value = false;
  }
}

function onCreateEvent() {
  showCreateEventPopup.value = true;
}

function onConnectEvent() {
  // TODO: 彈出連結活動表單或導向連結頁
  alert('Connect Event clicked');
}


watch(
  () => userStore.user,
  (user) => {
    if (user) {
      fetchMyEvents();
    } else {
      myEvents.value = [];
    }
  },
  { immediate: true }
);


</script>
