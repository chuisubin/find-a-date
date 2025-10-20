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
        </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useUserStore } from '../../stores/user';
import { useThemeStore } from '../../stores/theme';
import { storeToRefs } from "pinia";

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
});
const themeStore = useThemeStore();
const userStore = useUserStore();
const selectedDates = ref([]);
const { isDark } = storeToRefs(themeStore);

const calendarAttributes = ref([
  { key: "marked_by_member", dates: ["2025-10-30"], dot:'green' },
  { key: "selected", dates: selectedDates.value, highlight: "green" },
]);

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
};
</script>

<style>

</style>