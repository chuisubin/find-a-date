<template>
  <div class="w-full mx-auto lg:pt-10">
    <div>
      <h1
        class="mb-4 lg:mb-6 text-center text-black dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold"
      >
        輕鬆搞定下次聚會！
      </h1>
      <h2 class="mb-6 lg:mb-10 sub_title_color text-center text-base lg:text-xl">
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
      <Popup v-model="showCreateEventPopup" @close="() => (showCreateEventPopup = false)">
      <CreateEventPopup
          @close="() => (showCreateEventPopup = false)"
      /></Popup>
       <Popup v-model="showConnectEventPopup" @close="() => (showConnectEventPopup = false)">
      <ConnectEventPopup v-model="showConnectEventPopup" @close="() => (showConnectEventPopup = false)" />
      </Popup>
      <div class="" v-if="eventList.length>0">
        <MyEventListView :myEvents="eventList"  />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, watch } from "vue";
import { useUserStore } from "@/stores/user";
import CreateEventPopup from "@/components/home/CreateEventPopup.vue";
import ConnectEventPopup from "@/components/home/ConnectEventPopup.vue";
import { fetchUserName } from "@/api/user";
import MyEventListView from "../components/home/MyEventListView.vue";
import Popup from "@/components/Popup.vue";
import { supabase } from "@/api/supabase"

const userStore = useUserStore();
const showCreateEventPopup = ref(false);
const showConnectEventPopup = ref(false);
const fetching = ref(false);
const eventList = ref([])


function onCreateEvent() {
  showCreateEventPopup.value = true;
}

function onConnectEvent() {
  showConnectEventPopup.value = true;
}

onMounted(async () => {
  const idList = JSON.parse(localStorage.getItem('event_id_list') || '[]')
  let events = []
  if (idList.length > 0) {
    const { data, error } = await supabase
      .from('events')
      .select('id, public_code, title, description, status, decided_date, events_members (id)')
      .in('id', idList)
    if (!error && data) {
      events = data
    }
  }
  eventList.value = events
  console.log("onMounted", eventList.value)
})

</script>
