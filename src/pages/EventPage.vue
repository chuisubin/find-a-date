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
              <span v-if="event.status" class="px-3 py-1 rounded text-base font-semibold"
                :class="{
                  'bg-blue-100 text-blue-700': event.status === 'voting',
                  'bg-green-100 text-green-700': event.status === 'decided',
                  'bg-gray-200 text-gray-600': event.status === 'closed'
                }"
              >{{ event.status === 'voting' ? '投票中' : event.status === 'decided' ? '已決定' : event.status === 'closed' ? '已結束' : event.status }}</span>
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
          </div>
          <div
            class="bg-red-500 text-white text-center p-2 rounded-md cursor-pointer"
            @click="toggleDeadlineView"
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
import { nextTick } from "vue";
import EventCalendar from "@/components/event/EventCalendar.vue";
import { debounce } from 'lodash';

const showConfirmDatePopup = ref(false);
const confirmDate = ref("");
const confirming = ref(false);

const descTextarea = ref(null);

const editingDesc = ref(false);
const editedDesc = ref("");

const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);
const route = useRoute();
const event = ref(null);
const loading = ref(true);
const members = ref([]);
const owner = ref(null);
const userStore = useUserStore();
const editingTitle = ref(false);
const editedTitle = ref("");


// 統計所有最多人共同選擇的日期（不限3個，只要人數相同且最多都顯示）
const topDates = computed(() => {
  if (!event.value || !event.value.availabilities) return [];
  const dateCount = {};
  event.value.availabilities.forEach(a => {
    (a.available_dates || []).forEach(date => {
      dateCount[date] = (dateCount[date] || 0) + 1;
    });
  });
  const arr = Object.entries(dateCount)
    .map(([date, count]) => ({ date, count }));
  if (!arr.length) return [];
  const maxCount = Math.max(...arr.map(item => item.count));
  return arr
    .filter(item => item.count === maxCount)
    .sort((a, b) => a.date.localeCompare(b.date));
});




const isOwner = computed(() => {
  return (
    userStore.user && event.value && userStore.user.id === event.value.owner_id
  );
});
const showDeadlineAsDays = ref(true);
const toggleDeadlineView = () => {
  showDeadlineAsDays.value = !showDeadlineAsDays.value;
};

const deadlineViewText = computed(() => {
  if (!event.value?.deadline_date) return "";
  if (!showDeadlineAsDays.value) return event.value.deadline_date;
  // 計算剩餘天數
  const today = new Date();
  const deadline = new Date(event.value.deadline_date);
  // 計算相差毫秒數
  const diffTime = deadline.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `剩餘 ${diffDays} 天`;
  if (diffDays === 0) return "今天截止";
  return "已截止";
});



function openConfirmDate(date) {
  confirmDate.value = date;
  showConfirmDatePopup.value = true;
}

async function confirmFinalDate() {
  if (!event.value?.id || !confirmDate.value) return;
  confirming.value = true;
  try {
    // API: 更新 event status/confirm_date_start/confirm_date_end
    await updateEventFinalDate(event.value.id, confirmDate.value);
    event.value.status = "decided";
    event.value.confirm_date_start = confirmDate.value;
    event.value.confirm_date_end = confirmDate.value;
    toast.success("已設定最終日期");
    showConfirmDatePopup.value = false;
  } catch (e) {
    toast.error("設定失敗");
  } finally {
    confirming.value = false;
  }
}


function autoResizeDesc() {
  nextTick(() => {
    const el = descTextarea.value;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  });
}

function startEditDesc() {
  editedDesc.value = event.value?.description || "";
  editingDesc.value = true;
}

function cancelEditDesc() {
  editingDesc.value = false;
}

async function saveDesc() {
  if (!event.value?.id) return;
  try {
    await updateEventDescription(event.value.id, editedDesc.value);
    event.value.description = editedDesc.value;
    toast.success("描述已更新");
    editingDesc.value = false;
  } catch (e) {
    toast.error("描述更新失敗");
  }
}

async function fetchEvent() {
  loading.value = true;
  try {
    event.value = await fetchEventByPublicCode(route.params.code);
    if (event.value?.events_members) {
      members.value = event.value.events_members.map((m) => ({
        user_id: m.user_id,
        username: m.users?.username,
        email: m.users?.email,
      }));

      owner.value =
        members.value.find((it) => it.user_id == event.value?.owner_id) ?? null;
    } else {
      owner.value = null;
      members.value = [];
    }
  } catch (e) {
    event.value = null;
    members.value = [];
    owner.value = null;
  }
  loading.value = false;
}

async function handleJoin() {
  if (!userStore.user) {
    userStore.openAuthPopup();
    return;
  }
  if (!event.value?.id) {
    toast.error("活動資料錯誤");
    return;
  }
  try {
    await joinEvent(event.value.id, userStore.user.id);
    await fetchEvent();
    toast.success("成功加入活動!");
  } catch (e) {
    toast.error("加入失敗: " + (e.message || e));
  }
}

const handleLeave = async () => {
  if (!userStore.user) {
    userStore.openAuthPopup();
    return;
  }
  if (!event.value?.id) {
    toast.error("活動資料錯誤");
    return;
  }
  try {
    await leaveEvent(event.value.id, userStore.user.id);
    // 從成員列表移除
    const idx = members.value.findIndex(m => m.user_id === userStore.user.id);
    if (idx !== -1) {
      members.value.splice(idx, 1);
    }
        await fetchEvent();

    toast.success("已離開活動!");
  } catch (e) {
    toast.error("離開失敗: " + (e.message || e));
  }
};

const debouncedFetchEvent = debounce(fetchEvent, 1000);

watch(() => userStore.user, () => {
  debouncedFetchEvent();
},
{ immediate: true }
);


function startEditTitle() {
  editedTitle.value = event.value?.title || "";
  editingTitle.value = true;
}
function cancelEditTitle() {
  editingTitle.value = false;
}

async function saveTitle() {
  if (!editedTitle.value.trim() || !event.value?.id) return;
  try {
    await updateEventTitle(event.value.id, editedTitle.value.trim());
    event.value.title = editedTitle.value.trim();
    toast.success("標題已更新");
    editingTitle.value = false;
  } catch (e) {
    toast.error("標題更新失敗");
  }
}


const confirmCloseEvent = async() => {
  //關閉事件後導回首頁
 await closeEvent(event.value.id);
  window.location.href = "/";
};
</script>

<style scoped>
.no-scrollbar {
  overflow: hidden !important;
}
.custom-no-resize {
  resize: none !important;
}
</style>
