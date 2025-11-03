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
    
  </div>
</template>

<script setup>
import { computed,ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { avatarIconList } from "~/assets/images/avatar/index.js";

const props = defineProps({
  members: Array,
  currentUser: Object
})



const getAvatarIconSrc = (member) => {
  return avatarIconList.find((i)=>i.name===member?.avatar_name)?.src??'';
};


</script>

<style></style>
