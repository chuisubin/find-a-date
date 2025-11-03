<template>
  <Header :currentUser="currentUser" :cleanUser="cleanUser" />
  <div class="w-full mx-auto pt-20 lg:max-w-screen-lg">
    <div
      v-if="loading"
      class="z-50 text-gray-400 fixed inset-0 bg-black/30 flex items-center justify-center"
    >
      <div class="bg-black/50 text-white p-10 rounded-md">Loading...</div>
    </div>
    <div v-if="event">
      <div class="mb-4">
        <EventDetail :event="event" :isOwner="isOwner" />
        <div class="flex flex-col gap-4 lg:flex-row">
          <div class="w-full">
            <NewCalendar
              v-if="event"
              :event="event"
              :fetchEvent="fetchEvent"
              :currentUser="currentUser"
            />
          </div>
          <div class="w-full lg:w-fit">
            <MemberList :members="members" :currentUser="currentUser" />
          </div>
        </div>
      </div>
      <div class="" v-if="members.length > 1">
        <DateRank
          :event="event"
          :isOwner="isOwner"
          :confirmFinalDate="confirmFinalDate"
        />
      </div>
      <div
        v-if="event.status == 'voting' && isOwner"
        class="relative mt-4 w-full text-right"
      >
        <span
          class="text-sm cursor-pointer  hover:text-error-text text-error-light font-bold"
          @click="showClosePopup = true"
        >
          關閉活動
        </span>
      </div>

      <!-- <Popup v-model="showChooseUser" :enableClickOutside="false"  :showClose="false"> -->
      <div v-if="showChooseUser && event">
        <EventChooseUser
          :event="event"
          :verifyPin="verifyPin"
          :createMember="createMember"
        />
      </div>
      <Popup v-model="showClosePopup" :showClose="true">
        <div class="">
          <h2
            class="text-center text-xl lg:text-3xl font-bold mb-2 text-red-600"
          >
            警告
          </h2>
          <div class="mb-4 text-center">
            你確定要關閉此活動嗎？<br />此操作不可復原，所有人將無法再編輯或投票。
          </div>
          <div class="flex gap-2 justify-end">
            <button class="btn cancel_btn" @click="showClosePopup = false">
              取消
            </button>
            <button class="btn enter_btn" @click="confirmCloseEvent">
              確定關閉
            </button>
          </div>
        </div>
      </Popup>
    </div>
  </div>
</template>

<script setup>
import MemberList from "~/components/event/MemberList.vue";
import { useEvent } from "~/composables/useEvent";
import EventDetail from "~/components/event/EventDetail.vue";
import NewCalendar from "~/components/event/NewCalendar.vue";
import DateRank from "~/components/event/DateRank.vue";
import EventChooseUser from "~/components/auth/EventChooseUser.vue";
import { ref, watch, onMounted, computed } from "vue";
import Header from "~/components/event/Header.vue";

const props = defineProps({
  code: String,
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
  confirmFinalDate,
} = useEvent();

const showClosePopup = ref(false);

const showChooseUser = computed(() => {
  return !currentUser.value ?? null;
});

watch(event, (val) => {
  if (val && val.id && typeof localStorage !== "undefined") {
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
    if (typeof document !== "undefined") {
      if (val) {
        document.body.style.overflow = "";
      } else {
        document.body.style.overflow = "hidden";
      }
    }
  },
  { immediate: true }
);

function confirmClose() {
  showClosePopup.value = false;
}
</script>
