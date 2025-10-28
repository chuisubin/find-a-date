<template>
  <div class="w-full mx-auto pt-10 lg:max-w-screen-lg">
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
            <!-- <EventCalendar :event="event" :fetchEvent="fetchEvent" /> -->
            <NewCalendar
              v-if="event"
              :event="event"
              :fetchEvent="fetchEvent" 
            />
          </div>
          <div class="w-full md:w-fit">
              <MemberList
               :members="members" 
               :owner="owner"
               :disabled="event.status !== 'voting'"
                @join="handleJoin"
                @leave="handleLeave"
                @closeEvent="confirmCloseEvent"
              />
          </div>
        </div>
      </div>
      <DateRank 
        :event="event"
        :isOwner="isOwner"
      />
    </div>
  </div>
</template>

<script setup>
import Popup from "@/components/Popup.vue";
// 你需要在 src/api/event.js 新增 updateEventFinalDate API
import { ref, onMounted, watch, computed } from "vue";
// v-calendar 必須已安裝: npm install v-calendar
// 若尚未在 main.js 註冊，請在 main.js 加入: import vcalendar from './plugins/vcalendar'; app.use(vcalendar);

import MemberList from "@/components/event/MemberList.vue";
// textarea 自動拉高高度
import { useEvent } from "@/hooks/useEvent";
import EventDetail from "../components/event/EventDetail.vue";
import NewCalendar from "../components/event/NewCalendar.vue";
import DateRank from "@/components/event/DateRank.vue";





const {
  event,
  loading,
  members,
  owner,
  isOwner,
  fetchEvent,
  handleJoin,
  handleLeave,
  confirmCloseEvent,
} = useEvent();
</script>
