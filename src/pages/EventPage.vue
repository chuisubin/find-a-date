<template>
  <div class="max-w-7xl mx-auto  ">
    <div v-if="loading" class="z-50 text-gray-400 fixed inset-0 bg-black/30 flex items-center justify-center">
      <div class="bg-black/50 text-white p-10 rounded-md">Loading...</div>
      </div>
    <div v-if="event">
      <div class="mb-4">
        <div class="   w-full">
          <div class="items-start justify-between flex flex-row">
          <div class="flex items-center gap-2 mb-2">
            <div class="flex items-center gap-3">
              <h1 v-if="!editingTitle" class="font-semibold text-5xl">
                {{ event.title }}
              </h1>
              <input
                v-else
                v-model="editedTitle"
                class="font-semibold text-5xl border-b border-gray-400 bg-transparent outline-none"
              />
             
            </div>
            <button
              v-if="isOwner && !editingTitle && event.status === 'voting'"
              @click="startEditTitle"
              class="ml-2 px-2 py-1 text-sm rounded bg-yellow-400 hover:bg-yellow-500 text-white"
            >
              Edit
            </button>
            <button
              v-if="editingTitle"
              @click="saveTitle"
              class="ml-2 px-2 py-1 text-sm rounded bg-green-500 hover:bg-green-600 text-white"
            >
              Save
            </button>
            <button
              v-if="editingTitle"
              @click="cancelEditTitle"
              class="ml-1 px-2 py-1 text-sm rounded bg-gray-400 hover:bg-gray-500 text-white"
            >
              Cancel
            </button>
             <span v-if="event.status" class="px-3 py-1 rounded text-base font-semibold"
                :class="{
                  'bg-blue-100 text-blue-700': event.status === 'voting',
                  'bg-green-100 text-green-700': event.status === 'decided',
                  'bg-gray-200 text-gray-600': event.status === 'closed'
                }"
              >{{ event.status === 'voting' ? '投票中' : event.status === 'decided' ? '已決定' : event.status === 'closed' ? '已結束' : event.status }}</span>
          </div>
          <div
            class="bg-red-500 text-white text-center p-2 rounded-md "
          >
            {{ deadlineViewText }}
          </div>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <p v-if="!editingDesc" class="mb-2 text-sm">
              {{ event.description }}
            </p>
            <textarea
              v-else
              v-model="editedDesc"
              class="mb-2 text-sm border-b border-gray-400 bg-transparent outline-none w-full no-scrollbar custom-no-resize"
              rows="1"
              ref="descTextarea"
              @input="autoResizeDesc"
            ></textarea>
            <button
              v-if="isOwner && !editingDesc && event.status === 'voting'"
              @click="startEditDesc"
              class="ml-2 px-2 py-1 text-sm rounded bg-yellow-400 hover:bg-yellow-500 text-white"
            >
              Edit
            </button>
            <button
              v-if="editingDesc"
              @click="saveDesc"
              class="ml-2 px-2 py-1 text-sm rounded bg-green-500 hover:bg-green-600 text-white"
            >
              Save
            </button>
            <button
              v-if="editingDesc"
              @click="cancelEditDesc"
              class="ml-1 px-2 py-1 text-sm rounded bg-gray-400 hover:bg-gray-500 text-white"
            >
              Cancel
            </button>
          </div>
          <div class="text-xs mb-2">Code: {{ event.public_code }}</div>
        </div>
        <EventCalendar
          :event="event"
          :fetchEvent="fetchEvent"
        />
        <div class="mt-2 flex flex-row justify-between items-start">
          <div>
          參與者:
          <div class="flex flex-row gap-1 flex-wrap">
            <p
              v-for="member of members"
              :key="member.user_id"
              class="w-fit py-1 px-4"
              :class="
                member.user_id == owner.user_id
                  ? 'bg-green-600 text-white '
                  : ''
              "
            >
              <span v-if="member.user_id == owner.user_id" class="font-bold"
                >搞手:</span
              >
              {{ member.username }}
            </p>
            </div>
          </div>
          <EventRoleBar
              :userId="userStore.user?.id"
              :ownerId="event?.owner_id"
              :members="members"
              :disabled="event.status !== 'voting'"
              @join="handleJoin"
              @leave="handleLeave"
              @closeEvent="confirmCloseEvent"
            />
        </div>
      </div>
      <div class="mt-8">
        <div v-if="event && event.availabilities && event.availabilities.length" class="mb-6">
          <h2 class="heading text-xl mb-2">最多人共同選擇的日期</h2>
          <ul>
            <li v-for="(item, idx) in topDates" :key="item.date" class="mb-2 flex items-center gap-2">
              <span class="font-bold text-lg">{{ idx + 1 }}.</span>
              <span
                  class="px-3 py-1 rounded bg-blue-100 text-blue-700"
                  :class="{ 'cursor-pointer hover:bg-blue-300': isOwner && event.status === 'voting' }"
                  @click="isOwner && event.status === 'voting' ? openConfirmDate(item.date) : null"
                >{{ item.date }}</span>
              <span class="text-sm text-gray-500">{{ item.count }} 人可行</span>
            </li>
          </ul>
        <Popup v-model="showConfirmDatePopup" :showClose="true">
            <div class="p-4">
              <h3 class="text-lg font-bold mb-2">確認最終日期</h3>
              <div class="mb-4">你確定要將 <span class="font-bold text-blue-700">{{ confirmDate }}</span> 設為最終活動日期嗎？</div>
              <div class="flex gap-2 justify-end">
                <button class="btn cancel_btn" @click="showConfirmDatePopup = false">取消</button>
                <button class="btn enter_btn" @click="confirmFinalDate" :disabled="confirming">確定</button>
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
import Popup from '@/components/Popup.vue';
// 你需要在 src/api/event.js 新增 updateEventFinalDate API

import { ref, onMounted, watch, computed } from "vue";
// v-calendar 必須已安裝: npm install v-calendar
// 若尚未在 main.js 註冊，請在 main.js 加入: import vcalendar from './plugins/vcalendar'; app.use(vcalendar);
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import {
  fetchEventByPublicCode, joinEvent, leaveEvent,
  updateEventTitle, updateEventDescription, updateEventFinalDate,
  closeEvent
 } from "@/api/event";
import EventRoleBar from "@/components/event/EventRoleBar.vue";
import { storeToRefs } from "pinia";
import { useThemeStore } from "@/stores/theme";
import { toast } from "vue3-toastify";
import { supabase } from "@/api/supabase";
// textarea 自動拉高高度
import EventCalendar from "@/components/event/EventCalendar.vue";
import { useEvent } from '@/hooks/useEvent';

const {
  showConfirmDatePopup,
  confirmDate,
  confirming,
  descTextarea,
  editingDesc,
  editedDesc,
  themeStore,
  isDark,
  route,
  event,
  loading,
  members,
  owner,
  userStore,
  editingTitle,
  editedTitle,
  topDates,
  isOwner,
  deadlineViewText,
  openConfirmDate,
  confirmFinalDate,
  autoResizeDesc,
  startEditDesc,
  cancelEditDesc,
  saveDesc,
  fetchEvent,
  handleJoin,
  handleLeave,
  startEditTitle,
  cancelEditTitle,
  saveTitle,
  confirmCloseEvent
} = useEvent();

  </script>