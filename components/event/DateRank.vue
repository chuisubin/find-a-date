<template>
  <div class="mt-8">
    <div v-if="event && event.availabilities && event.availabilities.length" class="mb-8">
      <h2 class="text-lg lg:text-xl  font-bold   flex items-center gap-2">
        最多人共同選擇的日期
      </h2>
      <p v-if="isOwner" class="text-gray-500 text-sm mt-2">點擊日期確認最終選擇</p>
      <ul class="grid grid-cols-1  gap-4 mt-4">
        <li
          v-for="(item, idx) in (showAll ? allDates : topDates)"
          :key="item.date"
          class="rounded-lg shadow px-2 lg:px-4 py-4 border flex flex-col gap-2 lg:gap-4 transition"
          :class="{ 'highlighted-item': item.count === memberCount }"
        >
          <div class="flex items-center gap-1.5 lg:gap-4">
            <div v-if="item.count === memberCount">
              <img 
                :src="mandarinImg" 
                alt="Mandarin" 
                class="w-6 h-6" 
                :draggable="false"
              />
            </div>
            <div v-else class="flex flex-row justify-center w-6 lg:w-7">
              <span class="font-semibold  text-blue-600 ">{{ idx + 1 }}</span>
            </div>
            <span
              class="px-2 lg:px-4 py-2 rounded-lg bg-blue-50 text-blue-800  tracking-wide"
              :class="{
  'cursor-pointer hover:bg-blue-200 ring-2 ring-blue-400': isOwner && event.status === 'voting',
                'hover:bg-yellow-200': isOwner && event.status === 'voting' &&item.count === memberCount,
                'highlighted-date': item.count === memberCount
              }"
              @click="isOwner && event.status === 'voting' ? openConfirmDate(item.date) : null"
            >
              {{ item.date }} {{ getDayOfWeek(item.date) }}
            </span>

            <button
              class="ml-auto text-gray-500 hover:text-gray-600 flex flex-row items-center gap-1 "
              @click="toggleExpand(idx)"
            >
            <span class="ml-auto flex items-center gap-1 text-sm lg:text-base ">
              <font-awesome-icon v-if="item.count === memberCount" :icon="['fa', 'check']" class="text-green-500 w-4 h-4" />
              <span class="font-semibold whitespace-nowrap" v-if="item.count === memberCount">齊人</span>
              <span class="whitespace-nowrap" v-else>人數: {{ item.count }}/{{ memberCount }}</span>
            </span>
              <font-awesome-icon :icon="expandedItems[idx] ? ['fa', 'chevron-up'] : ['fa', 'chevron-down']" />
            </button>
          </div>
          <Collapse :when="expandedItems[idx]" class=" text-sm text-gray-600">
            <div>
            <p class=" lg:text-lg  mb-2">選擇此日期的成員:</p>
            <div class="flex flex-row gap-4 flex-wrap ">
              <li v-for="member in getMembersForDate(item.date)" :key="member.username" class="flex items-center gap-2">
                <img
                  :src="getAvatarSrc(member.avatar_name)"
                  alt="Avatar"
                  class="w-6 h-6 rounded-full border-2 border-primary-light"
                />
                {{ member.username }}
              </li>
            </div>
            </div>
          </Collapse>
        </li>
      </ul>
      <div v-if="allDates.length > 6" class="mx-auto mt-4 cursor-pointer text-blue-600 underline w-fit" @click="setShowAll">
        {{ showAll ? '收起' : '顯示全部' }}
      </div>
      <Popup v-model="showConfirmDatePopup" :showClose="true">
        <div>
          <h3 class="text-xl font-bold mb-3 text-blue-700 flex items-center gap-2">
            <font-awesome-icon :icon="['fa', 'calendar']" class="text-blue-400 w-5 h-5" />
            確認最終日期
          </h3>
          <div class="mb-6">
            你確定要將
            <span class="font-bold text-blue-700">{{ confirmDate }}</span>
            設為最終聚會日期嗎？
          </div>
          <div class="flex gap-3 justify-end">
            <button
              class="btn cancel_btn"
              @click="showConfirmDatePopup = false"
              :disabled="confirming"
            >
              取消
            </button>
            <button
              class="btn enter_btn transition"
              @click="confirmFinalDateHandle"
              :disabled="confirming"
            >
              確定
            </button>
          </div>
        </div>
      </Popup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Popup from "~/components/Popup.vue";
import { toast } from "vue3-toastify";
import mandarinImg from '~/assets/images/mandarin.png';
import { avatarIconList } from "~/assets/images/avatar/index.js";
import { Collapse } from "vue-collapsed";

const props = defineProps({
  event: {
    type: Object,
    default: null,
  },
  isOwner: {
    type: Boolean,
    default: false,
  },
  confirmFinalDate: {
    type: Function,
    required: true,
  },
});

const isOwner = computed(() => props.isOwner);
const showConfirmDatePopup = ref(false);
const confirmDate = ref("");
const confirming = ref(false);
const showAll = ref(false);
const expandedItems = ref({});

const allDates = computed(() => {
  if (!props.event || !props.event.availabilities) return [];
  const dateCount = {};
  props.event.availabilities.forEach((a) => {
    (a.available_dates || []).forEach((date) => {
      dateCount[date] = (dateCount[date] || 0) + 1;
    });
  });

  const sortedDates = Object.entries(dateCount)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.count - a.count || a.date.localeCompare(b.date));
  return sortedDates;
});

const topDates = computed(() => allDates.value.slice(0, 6));
const maxCount = computed(() => (allDates.value.length > 0 ? allDates.value[0].count : 0));
const memberCount = computed(() => props.event?.events_members?.length || 0);
function setShowAll() {
  showAll.value = !showAll.value;
}

function openConfirmDate(date) {
  confirmDate.value = date;
  showConfirmDatePopup.value = true;
}

function getDayOfWeek(dateString) {
  const days = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const date = new Date(dateString);
  return days[date.getDay()];
}

function toggleExpand(idx) {
  expandedItems.value[idx] = !expandedItems.value[idx];
}

function getAvatarSrc(avatarName) {
  const avatar = avatarIconList.find((icon) => icon.name === avatarName);
  return avatar ? avatar.src : "未知頭像";
}

function getMembersForDate(date) {
  if (!props.event || !props.event.availabilities || !props.event.events_members) return [];

  // Create a map of events_member_id to member details for quick lookup
  const membersMap = props.event.events_members.reduce((map, member) => {
    map[member.id] = {
      username: member.username || "未知成員",
      avatar_name: member.avatar_name || "未知頭像",
    };
    return map;
  }, {});

  // Filter availabilities for the given date and map to member details using the membersMap
  return props.event.availabilities
    .filter((a) => a.available_dates.includes(date))
    .map((a) => membersMap[a.events_member_id] || { username: "未知成員", avatar_name: "未知頭像" });
}

async function confirmFinalDateHandle() {
  if (!props.event?.id || !confirmDate.value) return;
  confirming.value = true;
  try {
    const res = await props.confirmFinalDate({
      eventId: props.event.id,
      fields: {
        status: "decided",
        decided_date: confirmDate.value,
      },
    });

    if (res.data) {
      toast.success("已設定最終日期");
      showConfirmDatePopup.value = false;
    }
  } catch (e) {
    toast.error("設定失敗");
  } finally {
    confirming.value = false;
  }
}
</script>

<style scoped>
.heading {
  letter-spacing: 1px;
}

.highlighted-item {
  background-color: #fef3c7; /* Light yellow background */
  border: 2px solid #f59e0b; /* Amber border */
  border-radius: 0.5rem;
}

.highlighted-date {
  font-weight: bold;
  color: #d97706; /* Amber text color */
  text-decoration: underline;

  background-color: #fffbeb; /* Very light yellow background */
  @apply ring-amber-400 ;
}
</style>