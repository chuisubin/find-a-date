<template>
  <Header  :currentUser="currentUser" :cleanUser="cleanUser" />
  <div class="w-full mx-auto pt-20 lg:max-w-screen-lg">
    <div
      v-if="loading"
      class="z-50 text-gray-400 fixed inset-0 bg-black/30 flex items-center justify-center"
    >
      <div class="bg-black/50 text-white p-10 rounded-md">Loading...</div>
    </div>
    <div v-if="event">
      <div class="w-full">
        {{ currentUser?.username }}
        <button v-if="currentUser" @click="cleanUser">切換</button>
      </div>
      <div class="mb-4">
        <EventDetail :event="event" :isOwner="isOwner" />
        <div class="flex flex-col gap-4 lg:flex-row">
          <div class="w-full">
            <!-- <EventCalendar :event="event" :fetchEvent="fetchEvent" /> -->
            <NewCalendar
              v-if="event"
              :event="event"
              :fetchEvent="fetchEvent"
              :currentUser="currentUser"
            />
          </div>
          <div class="w-full md:w-fit">
            <MemberList
              :members="members"
              :owner="owner"
              :disabled="event.status !== 'voting'"
              @closeEvent="confirmCloseEvent"
              :currentUser="currentUser"
            />
          </div>
        </div>
      </div>
      <DateRank :event="event" :isOwner="isOwner" />

      <!-- <Popup v-model="showChooseUser" :enableClickOutside="false"  :showClose="false"> -->
      <div v-if="showChooseUser && event">
        <EventChooseUser
          :event="event"
          :verifyPin="verifyPin"
          :createMember="createMember"
        />
      </div>
      <!-- </Popup> -->
    </div>
  </div>
</template>

<script setup>
import MemberList from "@/components/event/MemberList.vue";
import { useEvent } from "@/hooks/useEvent";
import EventDetail from "../components/event/EventDetail.vue";
import NewCalendar from "../components/event/NewCalendar.vue";
import DateRank from "@/components/event/DateRank.vue";
import Popup from "@/components/Popup.vue";
import EventChooseUser from "@/components/auth/EventChooseUser.vue";
import { ref, watch, onMounted, computed } from "vue";
import Header from "@/components/Header.vue";

const props = defineProps({
  code: String
});
const {
  event,
  loading,
  members,
  owner,
  isOwner,
  fetchEvent,
  currentUser,
  confirmCloseEvent,
  createMember,
  verifyPin,
  cleanUser,
} = useEvent();

const showChooseUser = computed(() => {
  return !currentUser.value ?? null;
});

watch(event, (val) => {
  if (val && val.id) {
    // 取得現有 id list
    let idList = JSON.parse(localStorage.getItem("event_id_list") || "[]");
    if (!idList.includes(val.id)) {
      idList.push(val.id);
      localStorage.setItem("event_id_list", JSON.stringify(idList));
    }
  }
});

watch(
  currentUser,
  (val) => {
    if (val) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
  },
  { immediate: true }
);
</script>
