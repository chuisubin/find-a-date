<template>
  <div class="p-4 w-full">
    <h2 class="text-lg font-semibold mb-4">選擇用戶</h2>
    <div class="flex flex-row flex-wrap mb-4 gap-4 items-center">
      <div
        v-for="member in event.events_members"
        :key="member.id"
        :class="
          selectedMember && selectedMember.id == member.id
            ? 'border border-red-500'
            : ''
        "
        class="rounded-full border flex-1"
      >
        <button class="w-full" @click="() => selectMember(member)">
          <span>{{ member.username }}</span>
        </button>
      </div>
      <button
        @click="createMember"
        class="flex flex-col items-center justify-center gap-4 rounded-full border flex-1"
      >
        <span>新增+</span>
      </button>
    </div>
    <div v-if="showCreateForm" class="mb-4">
      <form @submit.prevent="createMemberSubmit" class="flex flex-col gap-4">
        <label>選擇頭像：</label>
        <!-- <input type="file" @change="onAvatarChange" /> -->
        <label>用戶名稱：</label>
        <input v-model="newUsername" required class="input" />
        <label>PIN（可選）：</label>
        <input
          v-model="newPin"
          type="password"
          class="input"
          autocomplete="new-password"
        />
        <label>重複 PIN：</label>
        <input
          v-model="repeatPin"
          type="password"
          class="input"
          autocomplete="new-password"
        />
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
      <form @submit.prevent="verifyPinSubmit" class="flex flex-col gap-4">
        <label>輸入 PIN：</label>
        <input
          v-model="pin"
          type="password"
          class="input"
          autocomplete="new-password"
        />
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
import { ref } from "vue";
const props = defineProps<{
  event: any;
    createMember: Function;
  verifyPin: Function;
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

const selectMember = (member) => {
  showPinInput.value = true;
  showCreateForm.value = false;
  selectedMember.value = member;
};
const createMember = () => {
  selectedMember.value = null;
  showCreateForm.value = true;
  showPinInput.value = false;
};

async function createMemberSubmit() {
  createError.value = "";
  if (newPin.value && newPin.value !== repeatPin.value) {
    createError.value = "PIN 不一致";
    return;
  }
  // API 建立新 member
  const data = await props.createMember({
    event_id: props.event.id,
    username: newUsername.value,
    pin: newPin.value,
    role: props.event.events_members.length === 0 ? "admin" : "member",
  });
  if (data) {
    showCreateForm.value = false;
    // 清空表單
    newUsername.value = "";
    newPin.value = "";
    repeatPin.value = "";
    // avatarFile.value = null
  } else {
    createError.value = "建立失敗";
  }
}

async function verifyPinSubmit() {
  // API 驗證 PIN
  const payload = {
    id: selectedMember.value.id,
    event_id: props.event.id,
    pin: pin.value,
  };
  const data = await props.verifyPin(payload);
  if (data) {
    showPinInput.value = false;
  } else {
    pinError.value =  "PIN 錯誤";
  }
}

function cancelPinInput() {
  showPinInput.value = false;
  selectedMember.value = null;
  pin.value = "";
  pinError.value = "";
}
</script>

<style></style>
