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
      <div class="mt-8">
        <div
          v-if="event && event.availabilities && event.availabilities.length"
          class="mb-6"
        >
          <h2 class="heading text-xl mb-2">最多人共同選擇的日期</h2>
          <ul>
            <li
              v-for="(item, idx) in topDates"
              :key="item.date"
              class="mb-2 flex items-center gap-2"
            >
              <span class="font-bold text-lg">{{ idx + 1 }}.</span>
              <span
                class="px-3 py-1 rounded bg-blue-100 text-blue-700"
                :class="{
                  'cursor-pointer hover:bg-blue-300':
                    isOwner && event.status === 'voting',
                }"
                @click="
                  isOwner && event.status === 'voting'
                    ? openConfirmDate(item.date)
                    : null
                "
                >{{ item.date }}</span
              >
              <span class="text-sm text-gray-500">{{ item.count }} 人可行</span>
            </li>
          </ul>
          <Popup v-model="showConfirmDatePopup" :showClose="true">
            <div class="p-4">
              <h3 class="text-lg font-bold mb-2">確認最終日期</h3>
              <div class="mb-4">
                你確定要將
                <span class="font-bold text-blue-700">{{ confirmDate }}</span>
                設為最終活動日期嗎？
              </div>
              <div class="flex gap-2 justify-end">
                <button
                  class="btn cancel_btn"
                  @click="showConfirmDatePopup = false"
                >
                  取消
                </button>
                <button
                  class="btn enter_btn"
                  @click="confirmFinalDate"
                  :disabled="confirming"
                >
                  確定
                </button>
              </div>
            </div>
          </Popup>
        </div>
      </div>
      <!-- <div v-else class="text-red-500">Event not found.</div> -->
    </div>
  </div>
</template>

<script setup>
import Popup from "@/components/Popup.vue";
// 你需要在 src/api/event.js 新增 updateEventFinalDate API
import { ref, onMounted, watch, computed } from "vue";
// v-calendar 必須已安裝: npm install v-calendar
// 若尚未在 main.js 註冊，請在 main.js 加入: import vcalendar from './plugins/vcalendar'; app.use(vcalendar);
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import {
  fetchEventByPublicCode,
  joinEvent,
  leaveEvent,
  updateEventFinalDate,
  closeEvent,
} from "@/api/event";
import MemberList from "@/components/event/MemberList.vue";
// textarea 自動拉高高度
import { useEvent } from "@/hooks/useEvent";
import EventDetail from "../components/event/EventDetail.vue";
import NewCalendar from "../components/event/NewCalendar.vue";






const {
  showConfirmDatePopup,
  confirmDate,
  confirming,
  event,
  loading,
  members,
  owner,
  topDates,
  isOwner,
  openConfirmDate,
  confirmFinalDate,
  fetchEvent,
  handleJoin,
  handleLeave,
  confirmCloseEvent,
} = useEvent();
</script>
