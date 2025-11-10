<template>
  <div class="invitation-card w-full relative h-full bg-gradient-to-b  from-[#ff7a00]/80 to-orange-600/80  text-white">

     <svg class="absolute inset-0 w-full h-full text-white/5" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern height="100" id="p" patternTransform="scale(0.8)" patternUnits="userSpaceOnUse" width="100"><path d="M50 0L100 25L50 50L0 25Z" fill="currentColor"></path><path d="M0 25L50 50L0 75Z" fill="currentColor"></path><path d="M50 50L100 75L50 100L0 75Z" fill="currentColor"></path><path d="M100 25L50 50L100 75Z" fill="currentColor"></path></pattern></defs><rect fill="url(#p)" height="100%" width="100%"></rect></svg>

    <div class="relative z-20 w-full h-full px-6 py-10">
      <div class="mb-6">
        <div class="flex flex-row items-center justify-start w-full mb-4 ">
          <img  :src="mandarinImg" class="w-5 h-5 mr-2" />
          <h1 class="text-lg font-bold  ">擇個吉日</h1>
        </div>
        
        <h2 class="text-3xl font-semibold text-shadow ">{{ event.title || '' }}</h2>
      </div>
      <p class="text-sm mb-4 whitespace-pre-wrap" v-if="event.description">
        {{ event.description }}
      </p>
      <div v-if="event.address || event.decided_date" class="bg-black shadow-lg bg-opacity-20 rounded-lg p-4 mt-4 flex flex-col items-start w-full">
        <p class="text-sm flex items-center mb-2" v-if="event.address">
          <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="w-4 h-4 mr-2" />
          地址: <span class="font-medium">{{ event.address }}</span>
        </p>
        <p class="text-sm flex items-center" v-if="event.decided_date">
          <font-awesome-icon :icon="['fas', 'calendar-alt']" class="w-4 h-4 mr-2" />
          日期: <span class="font-medium">{{ event.decided_date }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import mandarinImg from '~/assets/images/mandarin.png';
const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.invitation-card {
  font-family: "Arial", sans-serif;
  border: 2px solid #f3f4f6; /* Light gray border */
}
</style>