<template>
    <div class="w-full min-w-[18rem] md:min-w-[30rem] lg:min-w-[40rem]">
      <h1 class="text-center text-2xl lg:text-4xl font-bold mb-4">連接到聚會</h1>
        <form @submit.prevent="handleConnectEvent">
          <div class="mb-4">
            <label class="block mb-1">聚會代碼</label>
            <input v-model="eventCode" type="text" class="input w-full"
             placeholder="輸入聚會代碼" required />
          </div>
           <div v-if="errorMsg" class="error_text mb-2">{{ errorMsg }}</div>
          <div class="flex justify-center gap-2">
            <button type="submit" class="enter_btn btn" :disabled="isLoading||errorMsg!==''">連接</button>
          </div>
        </form>
      </div>
 
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { fetchEventByPublicCode } from '@/api/event';


const emit = defineEmits(['close', 'connected']);

const eventCode = ref("");
const errorMsg = ref("");
const router = useRouter();
const isLoading = ref(false);

watch(eventCode, () => {
  errorMsg.value = "";
});


async function handleConnectEvent() {
  if (!eventCode.value.trim()||errorMsg.value!=='') return;
  try {
      isLoading.value = true;

    const event = await fetchEventByPublicCode(eventCode.value.trim());
    if (!event || event.status === 'closed') {
      errorMsg.value = "該聚會已關閉或不存在";
      return;
    }
    // 跳轉到 event page 並帶入 public code
    router.push(`/event/${eventCode.value.trim()}`);
    emit('close');
    eventCode.value = "";
  } catch (e) {
    errorMsg.value = "查詢聚會失敗，請確認代碼是否正確";
  } finally {
    isLoading.value = false;
  }
}
</script>
