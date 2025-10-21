<template>
  <div class="max-w-xl mx-auto py-8 px-4">
    <template v-if="userStore.user">
      <div class="flex justify-center gap-4 mb-8">
        <button class="btn" @click="onCreateEvent">Create Event</button>
        <button class="btn" @click="onConnectEvent">Connect Event</button>
      </div>
      <CreateEventPopup v-model="showCreateEventPopup" @created="fetchMyEvents" />
      <ConnectEventPopup v-model="showConnectEventPopup" />
      <h2 class="text-xl font-bold mb-2">My Events</h2>
      <ul>
        <li v-for="event in myEvents" :key="event.id" class="card mb-2 p-4 flex items-center justify-between">
          <div>
            <div class="font-bold text-lg">{{ event.public_code }}</div>
            <div class="font-bold text-lg">{{ event.title }}</div>
            <div class="mb-1 text-sm text-gray-500">{{ event.description }}</div>
            <div class="mb-1 text-xs">
              Owner: <span class="font-semibold">{{ ownerNames && ownerNames[event.owner_id] ? ownerNames[event.owner_id] : event.owner_id }}</span>
            </div>
            <div v-if="event.max_members" class="mb-1 text-xs">
              Members: <span class="font-semibold">{{ event.events_members.length || 1 }}</span> / <span class="font-semibold">{{ event.max_members }}</span>
            </div>
            <div v-else class="mb-1 text-xs">
              Members: <span class="font-semibold">{{ event.events_members.length || 1 }}</span> (No limit)
            </div>
          </div>
          <button @click="goToEvent(event.public_code)" class="ml-4 p-2 rounded-full hover:bg-gray-200 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
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
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import CreateEventPopup from '../components/CreateEventPopup.vue';
import ConnectEventPopup from '../components/ConnectEventPopup.vue';
import { fetchUserEventsByUserId } from '../api/event';
import { fetchUserName } from '../api/user';
const router = useRouter();
function goToEvent(publicCode) {
  router.push({ path: `/event/${publicCode}` });
}

const userStore = useUserStore();
const myEvents = ref([]);
const ownerNames = ref({});
const showCreateEventPopup = ref(false);
const showConnectEventPopup = ref(false);
const fetching = ref(false);

async function fetchMyEvents() {
  if (fetching.value) return;
  if (!userStore.user) {
    myEvents.value = [];
    return;
  }
  try {
    fetching.value = true;
    myEvents.value = await fetchUserEventsByUserId(userStore.user.id) || [];
    // Fetch owner names for each event
      for (const event of myEvents.value) {
      if (event.owner_id && !ownerNames.value[event.owner_id]) {
        try {
          ownerNames.value[event.owner_id] = await fetchUserName(event.owner_id);
        } catch (e) {
          ownerNames.value[event.owner_id] = event.owner_id;
        }
      }
    }
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
  showConnectEventPopup.value = true;
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
