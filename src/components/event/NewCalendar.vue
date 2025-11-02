<template>
  <div class=" border rounded-lg ">
    <CustomCalendar
      :model-value="selectedDates"
      :enable-dates="computedEnableDates"
      :init-year="initYear"
      :init-month="initMonth"
      :cols="calendarCols"
      :highlight-dates="highlightDates"
      :dots-map="dotsMap"
      :highlight-users="highlightUsersMap"
      @select-date="onSelectDate"
      :currentUser="currentUser"
    />
    
  </div>
  <div class="flex gap-2  p-4" v-if=" isDatesModified">
      <button
        @click="saveAvailabilitiesHandle"
        class="enter_btn btn flex flex-row items-center gap-2 whitespace-nowrap"
      >
        <font-awesome-icon :icon="['fa', 'check']" class="w-4 lg:w-5 lg:h-5" />
        <span class="hidden lg:block">保存</span>
      </button>
      <button
        @click="cancelSelection"
        class="cancel_btn btn flex flex-row items-center gap-2 whitespace-nowrap"
      >
        <font-awesome-icon :icon="['fa', 'xmark']" class="w-4 lg:w-5 lg:h-5" />
        <span class="hidden lg:block">取消</span>
      </button>
    </div>
</template>

<script setup>


import { ref, computed, watch } from 'vue';
import { useUserStore } from "@/stores/user";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import CustomCalendar from "@/components/event/CustomCalendar.vue";
import { saveAvailabilities } from "@/api/event";
import { toast } from "vue3-toastify";

const props = defineProps({
  event: {
    type: Object,
    default: null,
    },
  fetchEvent: { 
    type: Function,
    default: null,
  },
  currentUser: {
    type: Object,
    default: null,
  },
});

const calendarCols = computed(() => {
  const start = props.event?.enable_start_date;
  const end = props.event?.enable_end_date;
  if (!start || !end) return 2;
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end.split("-").map(Number);
  return sy === ey && sm === em ? 1 : 2;
});
const initYear = computed(() => {
  if (!props.event?.enable_start_date) return null;
  return Number(props.event.enable_start_date.split("-")[0]);
});
const initMonth = computed(() => {
  if (!props.event?.enable_start_date) return null;
  // JS 月份是 0-based
  return Number(props.event.enable_start_date.split("-")[1]) - 1;
});


const today = new Date();
const year = ref(initYear ?? today.getFullYear());
const month = ref(initMonth !== null ? initMonth : today.getMonth());
const hoveredDate = ref(null);
const selectedDates = ref([]);



const weekdays = ['日', '一', '二', '三', '四', '五', '六'];





const mySavedDates = computed(() => {
  const my = props.event?.availabilities?.find(
    (a) => a.events_member_id === props.currentUser?.id
  );
  return my ? my.available_dates : [];
});
// 初始化時將自己已選的日期放入 selectedDates
watch(
  () => mySavedDates.value,
  (newDates) => {
    selectedDates.value = newDates.slice();
  },
  { immediate: true }
);

const isDatesModified = computed(() => {
  return (
    JSON.stringify([...selectedDates.value].sort()) !==
    JSON.stringify([...mySavedDates.value].sort())
  );
});

watch(mySavedDates, (newDates) => {
  selectedDates.value = newDates.slice();
});




function formatDateToYMD(date) {
  // 保證 date 是 Date 物件
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const computedEnableDates = computed(() => {
  if (!props.event?.enable_start_date || !props.event?.enable_end_date) return [];
  const result = [];
  let d = new Date(props.event.enable_start_date);
  const endDate = new Date(props.event.enable_end_date);
  while (d <= endDate) {
    result.push(formatDateToYMD(d));
    d.setDate(d.getDate() + 1);
  }
  return result;
});


function cancelSelection() {
  selectedDates.value = mySavedDates.value.slice();
}

async function saveAvailabilitiesHandle() {
  if (!props.currentUser || !props.event?.id) return;
  try {
    // 這裡請根據你的API實際情況修改
    await saveAvailabilities({
      events_member_id: props.currentUser.id,
      event_id: props.event.id,
      available_dates: selectedDates.value,
    });
    // 重新取得event資料
    props.fetchEvent?.();
    // 可加提示
    toast.success("已保存可用日期");
  } catch (e) {
    toast.error("保存失敗");
  }
}

const otherAvailabilities = computed(() => {
  return props.event?.availabilities?.filter(a => a.events_member_id !== props.currentUser?.id) || [];
});

// 建立每個日期的選擇者 username 陣列
const highlightUsersMap = computed(() => {
  const map = {};
  otherAvailabilities.value.forEach(a => {
    a.available_dates.forEach(date => {
      if (!map[date]) map[date] = [];
      map[date].push(a.username);
    });
  });
  return map;
});

// highlightDates: 其他人選擇的日期
const highlightDates = computed(() => {
  const dates = new Set();
  otherAvailabilities.value.forEach(a => {
    a.available_dates.forEach(date => dates.add(date));
  });
  return Array.from(dates);
});
// dotsMap: 每個日期被選擇的人數
const dotsMap = computed(() => {
  const others = props.event?.availabilities?.filter(a => a.events_member_id !== props.currentUser?.id) || [];
  const map = {};
  others.forEach(a => {
    a.available_dates.forEach(date => {
      map[date] = (map[date] || 0) + 1;
    });
  });
  return map;
});

// 處理日期選擇
function onSelectDate(date) {
  // 只有 event.status 為 'voting' 才能選擇
  if (props.event?.status !== 'voting') return;
  if (!computedEnableDates.value.includes(date)) return;
  if (selectedDates.value.includes(date)) {
    selectedDates.value = selectedDates.value.filter(d => d !== date);
  } else {
    selectedDates.value = [...selectedDates.value, date];
  }
}

</script>

<style scoped>
.calendar-multi {
  display: flex;
  flex-direction: column;
  gap: 0;
}


</style>
