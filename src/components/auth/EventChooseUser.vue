<template>
  <div class="p-4">
    <h2 class="text-lg font-semibold mb-4">選擇用戶</h2>
    <div class="flex flex-row flex-wrap TODO mb-4 gap-4">
      <div v-for="member in event.events_members" :key="member.id" class="">
        <div class="rounded-full border">頭像</div>
        <span> {{ member.user_metadata?.username }}</span>
        <button class="normal_btn w-full" @click="selectMember(member)">
          {{ member.user_metadata?.username || member.email }}
        </button>
      </div>
      <div>
        <span>新增</span>
        <button @click="() => (showCreateForm = true)">+</button>
      </div>
    </div>
    <div v-if="showCreateForm" class="mb-4">
      <form @submit.prevent="createMember">
        <label>選擇頭像：</label>
        <!-- <input type="file" @change="onAvatarChange" /> -->
        <label>用戶名稱：</label>
        <input v-model="newUsername" required class="input" />
        <label>PIN（可選）：</label>
        <input v-model="newPin" type="password" class="input" />
        <label>重複 PIN：</label>
        <input v-model="repeatPin" type="password" class="input" />
        <button type="submit" class="btn">建立</button>
        <button type="button" @click="showCreateForm = false" class="btn ml-2">
          取消
        </button>
        <div v-if="createError" class="text-red-500 mt-2">
          {{ createError }}
        </div>
      </form>
    </div>
    <div v-if="showPinInput" class="mb-4">
      <form @submit.prevent="verifyPin">
        <label>輸入 PIN：</label>
        <input v-model="pin" type="password" class="input" />
        <button type="submit" class="btn">確認</button>
        <button type="button" @click="cancelPinInput" class="btn ml-2">
          取消
        </button>
        <div v-if="pinError" class="text-red-500 mt-2">
          {{ pinError }}
        </div>
      </form>
  </div>
  </div>
</template>

<script lang="ts" setup>
import {  ref } from "vue";
import { createEventMember, verifyEventMemberPin } from "@/api/event";
import { useUserStore } from "@/stores/user";
const props = defineProps<{
  event: any;
}>();

const showCreateForm = ref(false);
const showPinInput = ref(false);

const selectedMember = ref(null);
const pin = ref("");
const pinError = ref("");
const newUsername = ref("");
const newPin = ref("");
const repeatPin = ref("");
const createError = ref("");
// const avatarFile = ref(null)

const userStore = useUserStore();
const selectMember = (member) => {
  showPinInput.value = true;
};

async function createMember() {
  createError.value = "";
  if (newPin.value && newPin.value !== repeatPin.value) {
    createError.value = "PIN 不一致";
    return;
  }
  // API 建立新 member
  const { success, error, user } = await createEventMember({
    event_id: props.event.id,
    username: newUsername.value,
    pin: newPin.value,
    role: props.event.event_members.length === 0 ? "admin" : "member",
    // avatar: avatarFile.value,
  });
  if (success) {
    // userStore.setUser(user)
    showCreateForm.value = false;
    // 清空表單
    newUsername.value = "";
    newPin.value = "";
    repeatPin.value = "";
    // avatarFile.value = null
  } else {
    createError.value = error || "建立失敗";
  }
}

async function verifyPin() {
    // API 驗證 PIN
    const payload={
        user_id: selectedMember.value.id,
        event_id: props.event.id,
        pin: pin.value
    } 
  const { success, error, user } = await verifyEventMemberPin(payload)
  if (success) {
    userStore.setUser(user)
    showPinInput.value = false
  } else {
    pinError.value = error || 'PIN 錯誤'
  }
}

function cancelPinInput() {
  showPinInput.value = false
  selectedMember.value = null
  pin.value = ''
  pinError.value = ''
}
</script>

<style></style>
