<template>
  <div
    class="px-5 w-full inset-0 fixed z-10 bg-background-light flex flex-col items-center justify-start overflow-auto py-10 lg:py-20"
  >
    <div class="mx-auto w-fit flex flex-row items-center mb-4 lg:mb-6">
      <img
        :src="mandarinIcon"
        class="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 mr-3 lg:mr-4"
      />
      <span class="text-3xl md:text-5xl lg:text-6xl font-bold"
        >擇個<span class="text-primary-light dark:text-primary-dark">吉</span
        >日</span
      >
    </div>
    <div v-if="!(selectedMember || showCreateForm)">
      <h2 class="text-2xl lg:text-4xl mb-4">選擇用戶</h2>
      <div class="flex flex-row flex-wrap mb-4 gap-4 items-center">
        <div
          v-for="member in event?.events_members"
          :key="member?.id"
          :class="
            selectedMember && selectedMember.id == member.id
              ? 'border border-red-500'
              : ''
          "
          class="rounded-full border flex-1"
          @click="() => selectMemberHandle(member)"
        >
          <div class="mb-4"><img :src="''" /></div>

          <span>{{ member?.username }}</span>
        </div>
        <button
          v-if="!(selectedMember || showCreateForm)"
          @click="createMemberHandle"
          class="flex flex-col items-center justify-center gap-2 mx-auto"
        >
          <font-awesome-icon
            :icon="['fas', 'plus']"
            class="text-primary-light dark:text-primary-dark w-6 h-6 lg:w-12 lg:h-12"
          />
          <span class="text-lg lg:text-2xl text-primary-light">建立</span>
        </button>
      </div>
    </div>

    <div v-if="selectedMember"></div>

    <div v-if="showCreateForm" class="mb-4 w-full">
      <h2 class="text-2xl lg:text-4xl mb-4 text-center">建立用戶</h2>
      <form
        @submit.prevent="createMemberSubmit"
        class="mx-auto flex flex-col gap-4 w-full sm:w-fit sm:min-w-80"
      >
        <label
          class="flex items-center gap-2 cursor-pointer"
          @click="showAvatarList = !showAvatarList"
        >
          頭像：
          <img
            :src="selectedAvatar.src"
            class="w-12 h-12 lg:w-16 lg:h-16 rounded-full border"
          />
          <span class="text-sm text-primary-light"> (點擊更換頭像) </span>
        </label>

        <Collapse :when="showAvatarList">
          <div class="grid grid-cols-4 gap-4">
            <div
              class="flex justify-center"
              v-for="icon in avatarIconList"
              :key="icon"
            >
              <img
                :draggable="false"
                :src="icon.src"
                class="w-10 h-10 lg:w-12 lg:h-12 rounded-full border cursor-pointer hover:border-2 hover:border-primary-light active:scale-95 transition-all"
                @click="selectAvatar(icon)"
              />
            </div>
          </div>
        </Collapse>
        <div class="flex flex-col items-start">
          <label class="whitespace-nowrap">名稱：</label>
          <input
            v-model="newUsername"
            name="username"
            type="text"
            required
            class="input w-full"
            autocomplete="username"
          />
        </div>
        <div class="flex flex-col items-start">
          <label>PIN</label>
          <input
            v-model="newPin"
            type="password"
            class="input w-full"
            autocomplete="new-password"
            required
            maxlength="6"
            inputmode="numeric"
            placeholder="請輸入6位數字"
          />
        </div>
        <div class="flex flex-col items-start">
          <label>重複 PIN：</label>
          <input
            v-model="repeatPin"
            type="password"
            class="input w-full"
            autocomplete="new-password"
            required
            maxlength="6"
            inputmode="numeric"
            placeholder="請再輸入6位數字"
          />
        </div>
        <div class="flex flex-row items-center gap-4">
          <button type="submit" class="btn enter_btn w-full">建立</button>
          <button
            type="button"
            @click="cancelHandle"
            class="btn cancel_btn w-full"
          >
            取消
          </button>
        </div>
        <div v-if="createError" class="text-error-light mt-2">
          {{ createError }}
        </div>
      </form>
    </div>
    <div v-if="selectedMember" class="mb-4">
      <form @submit.prevent="verifyPinSubmit" class="flex flex-col gap-4">
        <label>輸入 PIN：</label>
        <!-- 隱藏 username 欄位供密碼表單用 -->
        <input
          type="text"
          name="username"
          :value="selectedMember ? selectedMember.username : ''"
          autocomplete="username"
          style="display: none"
        />
        <input
          v-model="pin"
          type="password"
          class="input"
          autocomplete="new-password"
        />
        <button type="submit" class="btn">確認</button>
        <button type="button" @click="cancelHandle" class="btn ml-2">
          取消
        </button>
        <div v-if="pinError" class="text-error-light mt-2">
          {{ pinError }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import mandarinIcon from "@/assets/images/mandarin.png";
import { avatarIconList } from "@/assets/images/avatar/index.js";
import { Collapse } from "vue-collapsed";

const props = defineProps({
  event: Object,
  verifyPin: Function,
  createMember: Function,
});
const showCreateForm = ref(false);

const selectedMember = ref(null);
const pin = ref("");
const pinError = ref("");
const newUsername = ref("");
const newPin = ref("");
const repeatPin = ref("");
const createError = ref("");
const showAvatarList = ref(false);

const selectedAvatar = ref(avatarIconList[0]);

function selectAvatar(icon) {
  selectedAvatar.value = icon;
  showAvatarList.value = false;
}

const selectMemberHandle = (member) => {
  showCreateForm.value = false;
  selectedMember.value = member;
};
const createMemberHandle = () => {
  selectedMember.value = null;
  showCreateForm.value = true;
};

async function createMemberSubmit() {
  createError.value = "";
  if (newPin.value && newPin.value !== repeatPin.value) {
    createError.value = "PIN 不一致";
    return;
  }
  if (!/^\d{6}$/.test(newPin.value)) {
    createError.value = "PIN 必須為 6 位數字";
    return;
    }
  console.log('createMemberSubmit....',event );
  // API 建立新 member
  const data = await props.createMember({
    event_id: props.event.id,
    username: newUsername.value,
    pin: newPin.value,
    avatar_name: selectedAvatar.value.name, // 保存選擇的頭像 style
  });
  if (data) {
    showCreateForm.value = false;
    // 清空表單
    newUsername.value = "";
    newPin.value = "";
    repeatPin.value = "";
    selectedAvatar.value = avatarIconList[0];
    // avatarFile.value = null
  } else {
    createError.value = "建立失敗";
  }
}

async function verifyPinSubmit() {
  // API 驗證 PIN
  const payload = {
    id: selectedMember.value.id,
    event_id: event.id,
    pin: pin.value,
  };
  const data = await props.verifyPin(payload);
  if (data) {
    selectedMember.value = null;
  } else {
    pinError.value = "PIN 錯誤";
  }
}

function cancelHandle() {
  console.log("cancelHandle");
  selectedAvatar.value = avatarIconList[0];
  showAvatarList.value = false;
  selectedMember.value = null;

  pinError.value = "";
  resetForm();
}
const resetForm = () => {
  newUsername.value = "";
  newPin.value = "";
  repeatPin.value = "";
  createError.value = "";
  pin.value = "";
};
</script>

<style scoped></style>
