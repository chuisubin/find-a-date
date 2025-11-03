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
            >活動日期 <span class="primary_text">*</span></label
          >
          <div class="hidden lg:block">
           
              <DatePicker
                v-model:value="enableDateRange"
                 type="date"
              format="YYYY-MM-DD"
              value-type="date"
                :disabled-date="disableBeforeToday"
                range
                class="w-full"
                input-class="input w-full "
                required
                placeholder="請選擇活動日期範圍"
                :multi-calendars="false"
                :partial-update="true"
              />
       
          </div>
          <div class="lg:hidden flex flex-col gap-2">
           
              <DatePicker
                v-model:value="mobileStartDate"
                 type="date"
              format="YYYY-MM-DD"
              value-type="date"
                :disabled-date="date => disableBeforeToday(date) || (mobileEndDate ? date > mobileEndDate : false)"
                class="w-full"
                input-class="input w-full "
                required
                placeholder="開始日期"
              />
            
           
              <DatePicker
                v-model:value="mobileEndDate"
                  type="date"
              format="YYYY-MM-DD"
              value-type="date"
                :disabled-date="date => disableBeforeToday(date) || (mobileStartDate ? date < mobileStartDate : false)"
               
                class="w-full"
                input-class="input w-full "
                required
                placeholder="結束日期"
              />
            
          </div>
        </div>

        <div class="mb-4">
          <label class="block mb-1"
            >投票截止日期 <span class="primary_text">*</span><span class="text-xs text-gray-500">(請先選擇活動日期範圍)</span></label
          >
         
            <DatePicker
              placeholder="請選擇投票截止日期"
              v-model:value="newEventDeadlineDate"
              type="date"
              format="YYYY-MM-DD"
              value-type="date"
              :disabled-date="date => disableBeforeToday(date) || (enableDateRange.length === 2 && date > enableDateRange[1])"
              :disabled="enableDateRange.length !== 2"
              
              class="w-full"
              input-class="input w-full"
              required
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
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { formatDateLocal } from "~/utils/dateFormat.js";
import { ref, watch } from "vue";
import { createEvent } from "~/api/event";
import { toast } from 'vue3-toastify';
import {useRouter} from 'vue-router';

const emit = defineEmits(["close"]);

const router = useRouter();

const newEventTitle = ref("");
const newEventDescription = ref("");
const newEventDeadlineDate = ref(null);

const isLoading = ref(false);
const enableDateRange = ref([]);
const mobileStartDate = ref(null);
const mobileEndDate = ref(null);
const errorMsg = ref("");


watch([mobileStartDate, mobileEndDate], ([start, end]) => {
  if (start && end) {
    enableDateRange.value = [start, end];
  } else {
    enableDateRange.value = [];
  }
});

async function handleCreateEvent() {
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
  const start = formatDateLocal(startDate);
  const end = formatDateLocal(endDate);

  try {
  const data=  await createEvent({
      title: newEventTitle.value,
      description: newEventDescription.value,
      deadline_date: deadlineDate,
      enable_start_date: start,
      enable_end_date: end,
    });
    newEventTitle.value = "";
    newEventDescription.value = "";
    newEventDeadlineDate.value = null;
    enableDateRange.value = [];
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
