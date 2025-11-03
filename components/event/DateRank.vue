<template>
  <div class="mt-8">
    <div v-if="event && event.availabilities && event.availabilities.length" class="mb-8">
      <h2 class="text-lg lg:text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
        <font-awesome-icon :icon="['fa', 'crown']" class="text-yellow-500 w-6 h-6" />
        最多人共同選擇的日期
      </h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <li
          v-for="(item, idx) in (showAll ? allDates : topDates)"
          :key="item.date"
          class="rounded-lg shadow event_card flex items-center gap-4 transition"
        >
          <span class="font-bold lg:text-xl text-blue-600">{{ idx + 1 }}</span>
          <span
            class="px-4 py-2 rounded-lg bg-blue-50 text-blue-800 font-mono lg:text-lg tracking-wide"
            :class="{
              'cursor-pointer hover:bg-blue-200 ring-2 ring-blue-400': isOwner && event.status === 'voting',
            }"
            @click="isOwner && event.status === 'voting' ? openConfirmDate(item.date) : null"
          >
            {{ item.date }}
          </span>
          <span class="ml-auto flex items-center gap-1 text-sm">
            <font-awesome-icon :icon="['fa', 'check']" class="text-green-500 w-4 h-4" />
            {{ item.count }} 人可行
          </span>
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
            設為最終活動日期嗎？
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

const allDates = computed(() => {
  if (!props.event || !props.event.availabilities) return [];
  const dateCount = {};
  props.event.availabilities.forEach((a) => {
    (a.available_dates || []).forEach((date) => {
      dateCount[date] = (dateCount[date] || 0) + 1;
    });
  });
  return Object.entries(dateCount)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.count - a.count || a.date.localeCompare(b.date));
});

const topDates = computed(() => allDates.value.slice(0, 6));

function setShowAll() {
  showAll.value = !showAll.value;
}

function openConfirmDate(date) {
  confirmDate.value = date;
  showConfirmDatePopup.value = true;
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
</style>