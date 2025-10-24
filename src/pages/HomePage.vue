<template>
  <div class="w-full mx-auto pt-10">
    <div>
      <h1
        class="mb-4 lg:mb-6 text-center text-black dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold"
      >
        輕鬆搞定下次聚會！
      </h1>
      <h2 class="mb-6 lg:mb-10 text-gray-500 text-center text-base lg:text-xl">
        和朋友約時間﹐從未如此簡單。
      </h2>

      <div
        class="mx-auto flex justify-center gap-4 mb-12 lg:mb-16 lg:h-12 lg:flex-row flex-col max-w-sm lg:max-w-screen-md"
      >
        <button class="btn enter_btn w-full h-full" @click="onCreateEvent">
          創建新聚會
        </button>
        <button class="normal_btn  w-full h-full" @click="onConnectEvent">
          輸入代碼加入
        </button>
      </div>
      <CreateEventPopup
        v-model="showCreateEventPopup"
        @created="fetchMyEvents"
      />
      <ConnectEventPopup v-model="showConnectEventPopup" />
      <div v-if="userStore.user" class="">
        <MyEventListView :myEvents="myEvents" :ownerNames="ownerNames" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, watch } from "vue";
import { useUserStore } from "@/stores/user";
import CreateEventPopup from "@/components/home/CreateEventPopup.vue";
import ConnectEventPopup from "@/components/home/ConnectEventPopup.vue";
import { fetchUserEventsByUserId } from "@/api/event";
import { fetchUserName } from "@/api/user";
import MyEventListView from "../components/home/MyEventListView.vue";

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
    myEvents.value = (await fetchUserEventsByUserId(userStore.user.id)) || [];
    // Fetch owner names for each event
    for (const event of myEvents.value) {
      if (event.owner_id && !ownerNames.value[event.owner_id]) {
        try {
          ownerNames.value[event.owner_id] = await fetchUserName(
            event.owner_id
          );
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
  if (!userStore.user) {
    userStore.openAuthPopup();
    return;
  }
  showCreateEventPopup.value = true;
}

function onConnectEvent() {
  if (!userStore.user) {
    userStore.openAuthPopup();
    return;
  }
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
