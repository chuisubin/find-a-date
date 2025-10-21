<template>
<div class="m-2 border p-1 border-gray-300 rounded">
          <!-- 持續展開的多選日曆，使用 selectedDates ref 同步選擇 -->
  <v-calendar
    is-expanded
    :attributes="calendarAttributes"
    :multiple="true"
    @dayclick="handleSelect"
    borderless
    transparent
    expanded
    :initial-page="initialPage"
    :min-date="props.event.enable_start_date"
    :max-date="props.event.enable_end_date"
    :is-dark="isDark"
    title-position="left"
    :rows="2"
    :disabled-dates="disabledDates"
  />
  <div class="flex gap-2 mt-2" v-if="isJoinedMember && isDatesModified">
    <button @click="saveAvailabilities" class="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600">Save</button>
    <button @click="cancelSelection" class="px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-500">Cancel</button>
  </div>
        </div>
</template>

<script lang="ts" setup>
// user_id 對應 username 映射

import { supabase } from '@/api/supabase';
import { toast } from 'vue3-toastify';
import { saveAvailabilities as saveAvailabilitiesApi } from '@/api/event';
import { ref, computed, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useThemeStore } from '@/stores/theme';
import { storeToRefs } from "pinia";

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  fetchEvent: {
    type: Function,
    required: true
  }
});

const userStore = useUserStore();
const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);


const userIdToUsername = computed(() => {
  const members = props.event?.events_members || [];
  const map = {};
  members.forEach(m => {
    map[m.user_id] = m.users?.username || m.user_id;
  });
  return map;
});

// 取得 event 的 availabilities
const availabilities = computed(() => {
  console.log('availabilities change', props.event);
  return props.event?.availabilities || [];
});

// 自己已儲存的日期
const mySavedDates = computed(() => {
  const my = availabilities.value.find(a => a.user_id === userStore.user?.id);
  return my ? my.available_dates : [];
});


const selectedDates = ref<string[]>(mySavedDates.value.slice());
const isDatesModified = ref(false);

// 當 availabilities 變動時，selectedDates 也要同步
watch(mySavedDates, (newDates) => {
  selectedDates.value = newDates.slice();
  isDatesModified.value = false;
});

// 保存 selectedDates 到 availabilities table
async function saveAvailabilities() {
  if (!userStore.user || !props.event?.id) return;
  try {
    await saveAvailabilitiesApi({
      user_id: userStore.user.id,
      event_id: props.event.id,
      available_dates: selectedDates.value
    });
    props.fetchEvent();
    toast.success('已儲存可用日期');
    isDatesModified.value = false;
  } catch (e) {
    toast.error('儲存失敗');
  }
}

const isJoinedMember = computed(() => {
  if (!userStore.user || !props.event) return false;
  return props.event.events_members.some(m => m.user_id === userStore.user?.id);
});

function cancelSelection() {
  selectedDates.value = mySavedDates.value.slice();
  isDatesModified.value = false;
}



// 用於顏色分配（可自訂更多顏色）
const memberColors = ['red', 'blue', 'yellow', 'purple', 'orange', 'teal', 'pink'];




// 其他成員的日期
const otherMembers = computed(() => {
  return availabilities.value.filter(a => a.user_id !== userStore.user?.id);
});

const calendarAttributes = computed(() => {
  const attrs = [];
  // 自己選的日期（light）
  if (selectedDates.value.length) {
    attrs.push({
      key: 'selected',
      dates: selectedDates.value,
      highlight: { color: 'green', fillMode: 'light' },
    });
  }
  // 其他成員
  otherMembers.value.forEach((a, idx) => {
    const username = userIdToUsername.value[a.user_id] || a.user_id;
    attrs.push({
      key: `member_${a.user_id}`,
      dates: a.available_dates,
      dot: memberColors[idx % memberColors.length],
      popover: { label: `成員: ${username}` }
    });
  });
  return attrs;
});

const initialPage = computed(() => {
  //enable_start_date=YYYY-MM-DD,  initialPage need { month: 4, year: 2019 }
  const date = props.event?.enable_start_date;
  if (!date) return null;
  const [year, month] = date.split("-").map(Number);
  return { year, month };
});
// 禁用範圍外日期
const disabledDates = computed(() => {
  const start = props.event?.enable_start_date;
  const end = props.event?.enable_end_date;
  if (!start || !end) return [];
  const result = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  // 生成範圍外的日期
  for (
    let d = new Date(2000, 0, 1);
    d < startDate;
    d.setDate(d.getDate() + 1)
  ) {
    result.push(d.toISOString().split("T")[0]);
  }
  for (
    let d = new Date(endDate.getTime() + 86400000);
    d < new Date(2100, 0, 1);
    d.setDate(d.getDate() + 1)
  ) {
    result.push(d.toISOString().split("T")[0]);
  }
  return result;
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
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}-${mm}-${dd}`;
  // 如果是 disabled 日期則不處理
  if (disabledDates.value.includes(dateStr)) return;
  const index = selectedDates.value.findIndex((d) => d === dateStr);
  if (index !== -1) {
    selectedDates.value.splice(index, 1);
  } else {
    selectedDates.value.push(dateStr);
  }
  // 檢查是否有修改
  isDatesModified.value = JSON.stringify(selectedDates.value.slice().sort()) !== JSON.stringify(mySavedDates.value.slice().sort());
};
</script>

<style>

</style>