<template>
  <div class="max-w-7xl mx-auto py-4 px-4">
    <div v-if="loading" class="text-gray-400">Loading...</div>
    <div v-else-if="event">
      <div class=" mb-4">
        <div class="flex flex-row items-start justify-between w-full">
        <h1 class="font-semibold text-5xl mb-2">{{ event.title }}</h1>
        <div class="flex flex-row gap-2">
          <div class="bg-red-500 text-white text-center p-2 rounded-md cursor-pointer" @click="toggleDeadlineView">
            Deadline: {{ deadlineViewText }}
          </div>
          <EventRoleBar
        :userId="userStore.user?.id"
        :ownerId="event?.owner_id"
        :members="members"
        @join="handleJoin"
        @leave="handleLeave"
      /></div>
        </div>
        <p class=" mb-2 text-sm">{{ event.description }}</p>
        <div class="text-xs  mb-2">Code: {{ event.public_code }}</div>
       
      </div>
      <div class="m-2 border p-1 border-gray-300 rounded">
        <!-- 持續展開的多選日曆，使用 selectedDates ref 同步選擇 -->
        <v-calendar
          is-expanded
          :attributes="calendarAttributes"
          :multiple="true"
          @dayclick="handleSelect"
          borderless transparent 
          expanded 
          :initial-page="initialPage"
          :min-date="event.enable_start_date"
          :max-date="event.enable_end_date"
          :is-dark="isDark"
          title-position="left"
          :rows="2"
          :disabled-dates="disabledDates"
        />
      </div>
       <div class=" mt-2 ">
          參與者:
          <div class="flex flex-row gap-1 flex-wrap">
          <p  v-for="member of members" :key="member.user_id"
          class="w-fit py-1 px-4"
          :class="member.user_id == owner.user_id?'bg-green-600 text-white ':''"
          >
           <span v-if="member.user_id == owner.user_id" class="font-bold">搞手:</span>
           {{ member.username }}
            </p>
          </div>          
        </div>
    </div>
    <div v-else class="text-red-500">Event not found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, } from "vue";
// v-calendar 必須已安裝: npm install v-calendar
// 若尚未在 main.js 註冊，請在 main.js 加入: import vcalendar from './plugins/vcalendar'; app.use(vcalendar);
import { useRoute } from "vue-router";
import { useUserStore } from "../stores/user";
import {
  fetchEventByPublicCode,
  joinEvent,
} from "../api/event";
import EventRoleBar from "../components/EventRoleBar.vue";
import { storeToRefs } from 'pinia';
import { useThemeStore } from '../stores/theme';
import { toast } from 'vue3-toastify';

const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);

// 禁用範圍外日期
const disabledDates = computed(() => {
  const start = event.value?.enable_start_date;
  const end = event.value?.enable_end_date;
  if (!start || !end) return [];
  const result = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  // 生成範圍外的日期
  for (let d = new Date(2000, 0, 1); d < startDate; d.setDate(d.getDate() + 1)) {
    result.push(d.toISOString().split('T')[0]);
  }
  for (let d = new Date(endDate.getTime() + 86400000); d < new Date(2100, 0, 1); d.setDate(d.getDate() + 1)) {
    result.push(d.toISOString().split('T')[0]);
  }
  return result;
});

const route = useRoute();
const event = ref(null);
const loading = ref(true);
const members = ref([]);
const owner = ref(null);
const userStore = useUserStore();

// 日曆標記與多選
// 多選日期 state
const selectedDates = ref([]);

const initialPage = computed(() => { //enable_start_date=YYYY-MM-DD,  initialPage need { month: 4, year: 2019 }
  const date = event.value?.enable_start_date;
  if (!date) return null;
  const [year, month] = date.split("-").map(Number);
  return { year, month };
});

const isOwner = computed(() => {
  return userStore.user && event.value && userStore.user.id === event.value.owner_id;
});
const showDeadlineAsDays = ref(false);
const toggleDeadlineView = () => {
  showDeadlineAsDays.value = !showDeadlineAsDays.value;
};

const deadlineViewText = computed(() => {
  if (!event.value?.deadline_date) return '';
  if (!showDeadlineAsDays.value) return event.value.deadline_date;
  // 計算剩餘天數
  const today = new Date();
  const deadline = new Date(event.value.deadline_date);
  // 計算相差毫秒數
  const diffTime = deadline.setHours(0,0,0,0) - today.setHours(0,0,0,0);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `剩餘 ${diffDays} 天`;
  if (diffDays === 0) return '今天截止';
  return '已截止';
});

const calendarAttributes = ref([
  { key: 'marked_by_member', dates: ['2025-10-30'], highlight: 'blue' },
  { key: 'selected', dates: selectedDates.value, highlight: 'green' }
]);




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
    alert("活動資料錯誤");
    return;
  }
  try {
    await joinEvent(event.value.id, userStore.user.id);
    // 1入到成員列表
    members.value.push({
      user_id: userStore.user.id,
      username: userStore.user.username,
      email: userStore.user.email,
    });

    alert("成功加入活動!");
  } catch (e) {
    alert("加入失敗: " + (e.message || e));
  }
}

const handleLeave = async () => {
  alert("Leave event functionality not implemented yet.");
};

onMounted(() => {
  fetchEvent();
});

const handleSelect = (day) => {
  // 未登入則打開 Auth Popup
  if (!userStore.user) {
    userStore.openAuthPopup();
    return;
  }
  // 以本地日期字串
  const dateObj = day.date;
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;
  // 如果是 disabled 日期則不處理
  if (disabledDates.value.includes(dateStr)) return;
  const index = selectedDates.value.findIndex(d => d === dateStr);
  if (index !== -1) {
    selectedDates.value.splice(index, 1);
  } else {
    selectedDates.value.push(dateStr);
  }
};

</script>

<style scoped>

</style>
