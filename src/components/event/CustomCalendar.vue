<template>
  <div class="calendar-multi p-2 lg:p-4">
    <div v-for="offset in cols" :key="offset" class="calendar">
      <div class="calendar-header">
        <button v-if="offset === 1" @click="prevMonth" class="calendar-nav-btn">
          <FontAwesomeIcon :icon="['fa', 'chevron-left']" class="w-4 h-4 lg:w-5 lg:h-5" />
        </button><div v-else></div>
        <span>{{ getYearMonth(offset - 1).year }} 年 {{ getYearMonth(offset - 1).month + 1 }} 月</span>
        <button v-if="offset === 1" @click="nextMonth" class="calendar-nav-btn">
          <FontAwesomeIcon :icon="['fa', 'chevron-right']" class="w-4 h-4 lg:w-5 lg:h-5" />
        </button><div v-else></div>
      </div>
      <div class="calendar-grid">
        <div class="calendar-weekday" v-for="w in weekdays" :key="w">{{ w }}</div>
        <div
          v-for="day in getDays(offset - 1)"
          :key="day.date"
          class="calendar-day"
          :class="[
            highlightDates.includes(day.date) ? highlightBorderClass(dotsMap[day.date]) : '',
            day.day !== '' && props.enableDates.includes(day.date) ? 'enabled' : 'disabled'
          ]"
          :data-empty="day.day === '' ? 'true' : null"
          @click="day.day !== ''  ? handleSelectDate(day.date) : null"
          @mouseenter="day.day !== '' ? (hoveredDate = day.date) : null"
          @mouseleave="day.day !== '' ? (hoveredDate = null) : null"
        >
        <div
          class=""
        >
          {{ day.day }}
        </div>
        <FontAwesomeIcon v-if="modelValue.includes(day.date)"
          :icon="['fa', 'check']"
          class="w-4 h-4 lg:w-6 lg:h-6 primary_text calendar-selected-tick " />
       
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, computed, watch } from 'vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const props = defineProps({
  enableDates: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
  initYear: {
    type: Number,
    default: null,
  },
  initMonth: {
    type: Number,
    default: null,
  },
  cols: {
    type: Number,
    default: 1,
  },
  highlightDates: {
    type: Array,
    default: () => [],
  },
  dotsMap: {
    type: Object,
    default: () => ({}),
  },
  highlightUsers: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['select-date']);

const today = new Date();
const year = ref(props.initYear ?? today.getFullYear());
const month = ref(props.initMonth !== null ? props.initMonth : today.getMonth());
const hoveredDate = ref(null);
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

watch(() => props.initYear, (val) => {
  if (val !== null) year.value = val;
});
watch(() => props.initMonth, (val) => {
  if (val !== null) month.value = val;
});

function getYearMonth(offset) {
  let y = year.value;
  let m = month.value + offset;
  while (m > 11) {
    y++;
    m -= 12;
  }
  while (m < 0) {
    y--;
    m += 12;
  }
  return { year: y, month: m };
}

function getDays(offset) {
  const { year: y, month: m } = getYearMonth(offset);
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);
  const daysArr = [];
  for (let i = 0; i < firstDay.getDay(); i++) {
    daysArr.push({ day: '', date: `empty-${offset}-${i}` });
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    daysArr.push({ day: d, date: dateStr });
  }
  return daysArr;
}

function handleSelectDate(date) {
  emit('select-date', date);
}

function prevMonth() {
  if (props.cols === 2) {
    if (month.value <= 1) {
      year.value--;
      month.value = 10 + month.value;
    } else {
      month.value -= 2;
    }
  } else {
    if (month.value === 0) {
      year.value--;
      month.value = 11;
    } else {
      month.value--;
    }
  }
}
function nextMonth() {
  if (props.cols === 2) {
    if (month.value >= 10) {
      year.value++;
      month.value = month.value - 10;
    } else {
      month.value += 2;
    }
  } else {
    if (month.value === 11) {
      year.value++;
      month.value = 0;
    } else {
      month.value++;
    }
  }
}

const highlightDates = computed(() => {
  // 由父層傳入 highlightDates 陣列，代表別人選擇的日期
  return props.highlightDates || [];
});
const dotsMap = computed(() => {
  // 由父層傳入 dotsMap 物件，key 為日期，value 為人數
  return props.dotsMap || {};
});

// 根據人數決定 highlight border class
function highlightBorderClass(count) {
  if (!count || count < 1) return '';
  if (count < 3) return 'highlight-border-1';
  if (count < 6) return 'highlight-border-2';
  if (count < 10) return 'highlight-border-3';
  return 'highlight-border-4';
}
</script>

<style scoped>
.calendar-multi {
  display: flex;
  flex-direction: column;
  gap: 0px;
}
.calendar {
  width: 100%;
  border-radius: 8px;
 padding: 16px;

}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.calendar-nav-btn {
  background: none;
  border: none;
  padding: 0 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.calendar-weekday {
  font-weight: bold;
  text-align: center;
  color: #888;
}
.calendar-day {
  height: 36px;
  line-height: 36px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent; 
}


/* Highlight border classes for enabled/highlighted dates */
.highlight-border-1 {
  font-weight: bold;
  border: 2px solid #ff9800; /* 橙黃 */
}
.highlight-border-2 {
  font-weight: bold;
  border: 2px solid #1976d2; /* 深藍 */
}
.highlight-border-3 {
  font-weight: bold;
  border: 2px solid #43a047; /* 綠色 */
}
.highlight-border-4 {
  font-weight: bold;
  border: 2px solid #d32f2f; /* 紅色 */
}

.dark .highlight-border-1 {
  border-color: #ffb74d; /* 深橙黃 */
}
.dark .highlight-border-2 {
  border-color: #90caf9; /* 淺藍 */
}
.dark .highlight-border-3 {
  border-color: #66bb6a; /* 淺綠 */
}
.dark .highlight-border-4 {
  border-color: #ef5350; /* 淺紅 */
}


.calendar-day.enabled {
  background: #fff;
  color: #222;
  cursor: pointer;
  opacity: 1;
  pointer-events: auto;
}
/* Disabled style for all non-enabled dates */
.calendar-day.disabled {
  background: transparent;
  color: #bbb;
  cursor: not-allowed;
  opacity: 0.6;
  pointer-events: none;
}

/* Empty cells (padding at start of month) */
.calendar-day[data-empty="true"] {
  background: transparent;
  color: transparent;
  cursor: default;
  pointer-events: none;
}

.calendar-day .calendar-dots {
  position: absolute;
  right: 2px;
  bottom: 2px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.calendar-selected-tick {
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}
</style>
