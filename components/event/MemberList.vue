<template>
  <div class="border rounded-lg p-4 md:min-w-64 w-full">
    <div>
      <h2 class="text-lg lgtext-2xl font-bold mb-4">成員列表</h2>
    </div>
    <div class="flex flex-row flex-wrap lg:flex-col gap-4">
      <div v-for="(member, index) of props.members" :key="index">
        <div
          class="overflow-hidden text-ellipsis whitespace-nowrap max-w-full flex flex-row items-center gap-2"
          :class="
            member.role === 'admin'
              ? 'text-primary-light dark:text-primary-dark font-semibold'
              : ''
          "
        >
            <img :src="getAvatarIconSrc(member)" class="w-8 h-8 rounded-full" />
         <span>{{ member.username }}</span>
        
        </div>
      </div>
    </div>
    <div class="relative mt-4">
      <div  v-if="isOwner&& !disabled" class="w-full">
        <button
          class="w-full btn red_btn font-bold"
          @click="showClosePopup = true"
        >
          關閉活動
        </button>
        <Popup v-model="showClosePopup" :showClose="true">
          <div class="">
            <h2 class="text-center text-xl lg:text-3xl font-bold mb-2 text-red-600">警告</h2>
            <div class="mb-4 text-center ">
              你確定要關閉此活動嗎？<br/>此操作不可復原，所有人將無法再編輯或投票。
            </div>
            <div class="flex gap-2 justify-end">
              <button class="btn cancel_btn" @click="showClosePopup = false">
                取消
              </button>
              <button class="btn enter_btn" @click="confirmClose">
                確定關閉
              </button>
            </div>
          </div>
        </Popup>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed,ref } from "vue";
import Popup from "~/components/Popup.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { avatarIconList } from "~/assets/images/avatar/index.js";

const props = defineProps<{
  members: Array<any>;
  owner: any;
  disabled: boolean;
  currentUser: any;
}>();
const emit = defineEmits([ "closeEvent"]);

const disabled = computed(() => props.disabled);
const isOwner = computed(() => {
  return props.owner && props.currentUser && props.owner.id === props.currentUser.id;
});


const showClosePopup = ref(false);

const getAvatarIconSrc = (member) => {
  return avatarIconList.find((i)=>i.name===member?.avatar_name)?.src??'';
};

function confirmClose() {
  showClosePopup.value = false;
  emit("closeEvent");
}
</script>

<style></style>
