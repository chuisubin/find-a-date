<template>
  <div class="relative ">
    <div v-if="isOwner">
      <button class="px-4 py-2 rounded bg-red-600 text-white font-bold" @click="showClosePopup = true">關閉活動</button>
      <Popup v-model="showClosePopup" :showClose="true">
        <div class="p-4">
          <h3 class="text-lg font-bold mb-2 text-red-600">警告</h3>
          <div class="mb-4">你確定要關閉此活動嗎？此操作不可復原，所有人將無法再編輯或投票。</div>
          <div class="flex gap-2 justify-end">
            <button class="btn cancel_btn" @click="showClosePopup = false">取消</button>
            <button class="btn enter_btn" @click="confirmClose">確定關閉</button>
          </div>
        </div>
      </Popup>
    </div>
  <button v-else-if="isMember && !disabled" class="px-4 py-2 rounded bg-red-500 text-white font-bold" @click="onLeave">退出</button>
  <button v-else-if="!isMember && !disabled" class="px-4 py-2 rounded bg-blue-500 text-white font-bold" @click="onJoin">Join</button>
  </div>
</template>

<script setup>
import Popup from '@/components/Popup.vue';

import { ref, computed } from 'vue';
const props = defineProps({
  userId: String,
  ownerId: String,
  members: Array,
  disabled: Boolean,
});
const disabled = props.disabled;
const emit = defineEmits(['join', 'leave',"closeEvent"]);

const isOwner = computed(() => props.userId && props.userId === props.ownerId);
const isMember = computed(() => props.userId && props.members && props.members.some(m => m.user_id === props.userId));
const showClosePopup = ref(false);

function onJoin() {
  emit('join');
}
function onLeave() {
  emit('leave');
}
function confirmClose() {
  showClosePopup.value = false;
  emit('closeEvent');
}
</script>
