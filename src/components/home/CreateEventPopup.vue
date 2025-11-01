<template>
    <div class="w-full min-w-[18rem] md:min-w-[30rem] lg:min-w-[40rem]">
      <h1 class="text-center text-2xl lg:text-4xl font-bold mb-4">創建聚會</h1>
      <form @submit.prevent="handleCreateEvent">
        <div class="mb-4">
          <label class="block mb-1"
            >聚會標題 <span class="primary_text">*</span></label
          >
          <input
            placeholder="請輸入聚會標題"
            v-model="newEventTitle"
            maxlength="20"
            type="text"
            class="input w-full"
            required
          />
        </div>
       
        
        <div class="mb-4">
          <label class="block mb-1"
            >截止日期 <span class="primary_text">*</span></label
          >
          <DatePicker
            placeholder="請選擇截止日期"
            v-model:value="newEventDeadlineDate"
            type="date"
            format="YYYY-MM-DD"
            :disabled-date="disableBeforeToday"
            value-type="date"
            class="w-full"
            input-class="input w-full"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block mb-1"
            >活動日期 <span class="primary_text">*</span></label
          >
          <DatePicker
            v-model:value="enableDateRange"
            type="date"
            format="YYYY-MM-DD"
            :disabled-date="disableBeforeToday"
            range
            value-type="date"
            class="w-full"
            input-class="input w-full "
            required
            placeholder="請選擇活動日期範圍"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-1">描述</label>
          <textarea
            v-model="newEventDescription"
            class="input w-full resize-none"
            maxlength="200"
            rows="3"
            placeholder="請輸入聚會描述..."
          ></textarea>
        </div>
        <div v-if="errorMsg" class="error_text mb-2">{{ errorMsg }}</div>
        <div class=" gap-2 mt-4 w-full">
          <button type="submit" :disabled="isLoading" class="w-full enter_btn btn">
            創建
          </button>
        </div>
      </form>
    </div>

</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { formatDateLocal } from "@/utils/dateFormat.js";
import { ref, watch } from "vue";
import Popup from "@/components/Popup.vue";
import { createEvent } from "@/api/event";
import { useUserStore } from "@/stores/user";
import { toast } from 'vue3-toastify';
import {useRouter} from 'vue-router';

const emit = defineEmits(["close"]);

const router = useRouter();

const newEventTitle = ref("");
const newEventDescription = ref("");
const newEventDeadlineDate = ref(null);

const userStore = useUserStore();
const isLoading = ref(false);
const enableDateRange = ref([]);
const errorMsg = ref("");







async function handleCreateEvent() {
  console.log("create");
  errorMsg.value = "";
  if (!newEventTitle.value.trim()) {
    errorMsg.value = "請輸入聚會標題";
    return;
  }
  if (!newEventDeadlineDate.value) {
    errorMsg.value = "請選擇截止日期";
    return;
  }
  if (!enableDateRange.value || enableDateRange.value.length !== 2) {
    errorMsg.value = "請選擇有效的日期範圍";
    return;
  }

  isLoading.value = true;
  let [startDate, endDate] = enableDateRange.value;
  // 格式化為 YYYY-MM-DD
  const deadlineDate = formatDateLocal(newEventDeadlineDate.value);
  try {
  const data=  await createEvent({
      title: newEventTitle.value,
      description: newEventDescription.value,
      deadline_date: deadlineDate,
      enable_start_date: startDate,
      enable_end_date: endDate,
    });
    newEventTitle.value = "";
    newEventDescription.value = "";
    newEventDeadlineDate.value = null;
    enableDateRange.value = [];
    emit("close");
    toast.success("聚會創建成功");
    //route to event page with public code
    router.push(`/event/${data.public_code}`)
  } catch (e) {
    errorMsg.value = "創建聚會失敗";
  } finally {
    isLoading.value = false;
  }
}

function disableBeforeToday(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}


</script>
<style scoped>
.mx-datepicker {
  width: 100%;
}
</style>
