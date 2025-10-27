<template>
  <div class="m-2 border rounded-lg p-4 min-w-80">
    <div>
        <h2 class="text-lg lgtext-2xl font-bold mb-4">成員列表</h2>
    </div>
    <div class="flex flex-col gap-2">
        <div v-for="(member,index) of members" :key="index">
      <div class="overflow-hidden text-ellipsis whitespace-nowrap max-w-full" 
      :class="member.user_id===owner.user_id?'text-primary-light dark:text-primary-dark':''"
      >
        {{ member.username }} <span v-if="member.user_id === owner.user_id">(搞手)</span>
      </div>

        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/user";

const props = defineProps<{
  members: Array<any>;
  owner: any;
}>();

const userStore = useUserStore();

const isOwner = computed(() => {
  // Assuming you have access to userStore
  return props.owner && userStore.user && props.owner.id === userStore.user.id;
});

</script>

<style>

</style>