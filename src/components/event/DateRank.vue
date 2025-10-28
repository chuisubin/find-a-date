
<template>
  <div class="mt-8">
    <div v-if="event && event.availabilities && event.availabilities.length" class="mb-8">
      <h2 class="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
        <font-awesome-icon :icon="['fa', 'crown']" class="text-yellow-500 w-6 h-6" />
        最多人共同選擇的日期
      </h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <li
          v-for="(item, idx) in topDates"
          :key="item.date"
          class="rounded-lg shadow event_card flex items-center gap-4 px-4 py-3   transition"
        >
          <span class="font-bold text-xl text-blue-600">{{ idx + 1 }}</span>
          <span
            class="px-4 py-2 rounded-lg bg-blue-50 text-blue-800 font-mono text-lg tracking-wide"
            :class="{
              'cursor-pointer hover:bg-blue-200 ring-2 ring-blue-400': isOwner && event.status === 'voting',
            }"
            @click="isOwner && event.status === 'voting' ? openConfirmDate(item.date) : null"
          >
            {{ item.date }}
          </span>
          <span class="ml-auto flex items-center gap-1 text-sm ">
            <font-awesome-icon :icon="['fa', 'check']" class="text-green-500 w-4 h-4" />
            {{ item.count }} 人可行
          </span>
        </li>
      </ul>
      <Popup v-model="showConfirmDatePopup" :showClose="true">
        <div class="">
          <h3 class="text-xl font-bold mb-3 text-blue-700 flex items-center gap-2">
            <font-awesome-icon :icon="['fa', 'calendar']" class="text-blue-400 w-5 h-5" />
            確認最終日期
          </h3>
          <div class="mb-6 ">
            你確定要將
            <span class="font-bold text-blue-700">{{ confirmDate }}</span>
            設為最終活動日期嗎？
          </div>
          <div class="flex gap-3 justify-end">
            <button
              class="btn cancel_btn "
              @click="showConfirmDatePopup = false"
              :disabled="confirming"
            >
              取消
            </button>
            <button
              class="btn enter_btn   transition"
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
</template>

<script lang="ts" setup>
import { ref,computed  } from "vue";  
import Popup from "@/components/Popup.vue";
import { useEvent } from "@/hooks/useEvent";
import {
  fetchEventByPublicCode,
  joinEvent,
  leaveEvent,
  updateEventFields,
} from "@/api/event";
import { toast } from "vue3-toastify";

const props = defineProps({
  event: {
    type: Object,
    default: null,
    },
  isOwner: {
    type: Boolean,
    default: false,
  },
});

const event = computed(() => props.event);
const isOwner = computed(() => props.isOwner);
const showConfirmDatePopup = ref(false);
  const confirmDate = ref("");
const confirming = ref(false);


  const topDates = computed(() => {
    if (!event.value || !event.value.availabilities) return [];
    const dateCount = {};
    event.value.availabilities.forEach((a) => {
      (a.available_dates || []).forEach((date) => {
        dateCount[date] = (dateCount[date] || 0) + 1;
      });
    });
    const arr = Object.entries(dateCount).map(([date, count]) => ({
      date,
      count,
    }));
    if (!arr.length) return [];
    const maxCount = Math.max(...arr.map((item) => item.count));
    return arr
      .filter((item) => item.count === maxCount)
      .sort((a, b) => a.date.localeCompare(b.date));
  });

  function openConfirmDate(date) {
    confirmDate.value = date;
    showConfirmDatePopup.value = true;
}
   async function confirmFinalDate() {
    if (!event.value?.id || !confirmDate.value) return;
    confirming.value = true;
    try {
      await updateEventFields(event.value.id, {
        status: "decided",
        confirm_start_date: confirmDate.value,
        confirm_end_date: confirmDate.value,
      });
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
</script>

<style scoped>
.heading {
  letter-spacing: 1px;
}
</style>