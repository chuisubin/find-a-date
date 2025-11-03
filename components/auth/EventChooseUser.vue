<template>
  <div class="w-full inset-0 fixed z-10 bg-background-light overflow-auto">
    <div
      class="h-20 w-full px-4 z-10  lg:px-10  mb-10  "
    >
      <div
        class=" relative container mx-auto flex flex-row justify-between items-center h-full "
      >
        <a href="/" class="flex flex-row items-center w-fit">
          <img
            :src="mandarinIcon"
            class="w-7 h-7 mr-3 lg:mr-4"
            :draggable="false"
          />
          <span class="pickdate_title"
            >擇個<span
              class="pickdate_title text-primary-light dark:text-primary-dark"
              >吉</span
            >日</span
          >
        </a>

        <button
          class="btn cancel_btn"
          @click="() => props.setShowChooseUser(false)"
        >
          關閉
        </button>
      </div>
    </div>

    <div
      class="w-full  px-5 flex flex-col items-center justify-start "
    >
      <div v-if="!(selectedMember || showCreateForm)">
         <h2 class="text-base lg:text-xl mb-6 text-center" v-if="event?.events_members==0">第一個用戶會默認成為管理員</h2>
         <div v-else>
        <h2 class="text-2xl lg:text-4xl mb-2 text-center">選擇用戶</h2>
        <h3 v-if="event.status==='voting'" class="text-sm text-gray-500 text-center">
          點擊下列用戶以登入，或建立新用戶。
        </h3>
        <h3 v-else class="text-sm text-gray-500 text-center">點擊下列用戶以登入，投票已結束無法再建立新用戶</h3>
       </div>
        <div
          class="flex flex-row gap-4 mt-6 mb-4 items-center justify-center flex-wrap"
       v-if="event?.events_members.length" >
          <div
            v-for="member in event?.events_members"
            :key="member?.id"
            class="w-fit flex flex-col items-center gap-2 cursor-pointer  "
            @click="() => selectMemberHandle(member)"
          >
            <div class="">
              <img
                class="w-14 h-14 lg:w-20 lg:h-20 rounded-full border-4 border-primary-light"
                :src="
                  avatarIconList.find(
                    (icon) => icon.name === member?.avatar_name
                  )?.src ?? ''
                "
              />
            </div>
            <span class="text-xl lg:text-2xl">{{ member?.username }}</span>
          </div>
        </div>
        <button
          v-if="
            !(selectedMember || showCreateForm || event.status !== 'voting')
          "
          @click="createMemberHandle"
          class="flex flex-col items-center justify-center gap-2 mx-auto active:scale-95 transition-all"
        >
          <font-awesome-icon
            :icon="['fas', 'plus']"
            class="text-primary-light dark:text-primary-dark w-6 h-6 lg:w-12 lg:h-12"
          />
          <span class="text-lg lg:text-2xl text-primary-light">建立用戶</span>
        </button>
      </div>

      <div v-if="selectedMember"></div>

      <div v-if="showCreateForm" class="mb-4 w-full">
        <h2 class="text-2xl lg:text-4xl mb-10 text-center">建立用戶</h2>
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
              class="w-12 h-12 lg:w-16 lg:h-16 rounded-full border-2 border-primary-light"
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
                  class="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-primary-light cursor-pointer hover:border-2 hover:border-primary-hover active:scale-95 transition-all"
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
            />
          </div>
          <div class="flex flex-col items-start">
            <label>PIN:</label>
            <input
              v-model="newPin"
              type="password"
              class="input w-full"
              required
              maxlength="4"
              inputmode="numeric"
              placeholder="請輸入4位數字"
            />
          </div>
          <div class="flex flex-col items-start">
            <label>重複 PIN：</label>
            <input
              v-model="repeatPin"
              type="password"
              class="input w-full"
              required
              maxlength="4"
              inputmode="numeric"
              placeholder="請再輸入4位數字"
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
        <div class="flex flex-col items-center justify-center mx-auto">
          <img
            class="w-24 h-24 lg:w-32 lg:h-32 rounded-full mb-4 border-4 border-primary-light"
            :src="
              avatarIconList.find((i) => i.name === selectedMember.avatar_name)
                ?.src ?? ''
            "
          />
        </div>
        <div class="text-center text-xl lg:text-2xl mb-10">
          {{ selectedMember.username }}
        </div>
        <form @submit.prevent="verifyPinSubmit" class="flex flex-col gap-4">
          <label>PIN：</label>
          <input
            v-model="pin"
            type="password"
            placeholder="輸入4位數字"
            class="input w-full"
            maxlength="4"
            inputmode="numeric"
            required
          />
          <div class="w-full flex flex-row items-center gap-4">
            <button type="submit" class="btn enter_btn w-full">確認</button>
            <button
              type="button"
              @click="cancelHandle"
              class="btn cancel_btn w-full"
            >
              取消
            </button>
          </div>
          <div v-if="pinError" class="text-error-light mt-2">
            {{ pinError }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import mandarinIcon from "assets/images/mandarin.png";
import { avatarIconList } from "assets/images/avatar/index.js";
import { Collapse } from "vue-collapsed";

const props = defineProps({
  event: Object,
  verifyPin: Function,
  createMember: Function,
  setShowChooseUser: Function,
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
  if (!/^\d{4}$/.test(newPin.value)) {
    createError.value = "PIN 必須為 4 位數字";
    return;
  }
  // API 建立新 member
  const res = await props.createMember({
    event_id: props.event.id,
    username: newUsername.value,
    pin: newPin.value,
    avatar_name: selectedAvatar.value.name, // 保存選擇的頭像 style
  });
  if (res.data) {
    showCreateForm.value = false;
    // 清空表單
    newUsername.value = "";
    newPin.value = "";
    repeatPin.value = "";
    selectedAvatar.value = avatarIconList[0];
    // avatarFile.value = null
    props.setShowChooseUser(false);
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
  const res = await props.verifyPin(payload);
  if (res.data) {
    selectedMember.value = null;
    props.setShowChooseUser(false);

  } else {
    pinError.value = "PIN 錯誤";
  }
}

function cancelHandle() {
  selectedAvatar.value = avatarIconList[0];
  showAvatarList.value = false;
  selectedMember.value = null;
  showCreateForm.value = false;
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

onMounted(() => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = "hidden";
  }
});
onUnmounted(() => {
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
});
</script>

<style scoped></style>
