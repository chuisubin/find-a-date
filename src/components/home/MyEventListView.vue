<template>
  <div class="mx-auto max-w-screen-md">
    <h2 class="text-xl lg:text-3xl font-bold  mb-3 lg:mb-5  w-full">我參與的聚會</h2>
    
      <ul class="">
        <li v-for="event in myEvents" :key="event.id"
         :title="event.title"
        class=" relative mb-3 lg:mb-5 event_card   ">
          <div  class="absolute top-0 bottom-0 left-0 w-1.5 h-full bg-primary-light dark:bg-primary-dark  "></div>
          <div class="flex flex-row items-center "
          >
            <div class="w-full ">
            <div class=" flex flex-col  justify-center items-start gap-1 lg:gap-2">
              <div class="font-bold  text-lg lg:text-2xl truncate ">{{ event.title }}</div>
              <div v-if="event.status" class=" text-sm lg:text-base sub_title_color ">
              <span v-if="event.status === 'voting'">投票中 - {{  event.events_members.length }} 人參與</span>
              <span v-else-if="event.status === 'decided'">日期已定 : {{ event.decided_date}} - {{  event.events_members.length }} 人參與 </span>
              <span v-else-if="event.status === 'closed'">已結束</span>
              </div>
            </div>
          </div>

          <button @click="goToEvent(event.public_code)" class="ml-4 p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-600 transition h-fit">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        </li>
        <li v-if="myEvents.length === 0" class="text-gray-400 text-center py-8">No events found.</li>
      </ul>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
const props = defineProps<{
  myEvents: Array<any>;
}>();
const router = useRouter();

function goToEvent(publicCode: string) {
  router.push({ path: `/event/${publicCode}` });
}
</script>

<style>

</style>