<template>
  <div class="invitation-card w-full relative  h-fit bg-white rounded-lg shadow-lg overflow-hidden">
    <img
      :draggable="false"
      :src="cardImg"
      alt="Invitation Card"
      class="absolute inset-0 w-full h-full object-fill z-0"
    />
    <img
      :draggable="false"
      :src="mandarinImg"
      alt="Mandarin Icon"
      class="absolute w-10 h-10 top-4 right-4 z-10"
    />
    <div class=" relative z-20 w-full h-full flex flex-col justify-center items-center text-center px-6 py-10">
      <h1 class="text-2xl font-extrabold text-primary-dark mb-2">邀請函</h1>
      <h2 class="text-xl font-semibold text-primary-light mb-1">{{ event.title || '' }}</h2>
      <p class="text-sm text-gray-700 mb-4 whitespace-pre-wrap" v-if="event.description">
        {{ event.description }}
      </p>
      <p class="text-sm  text-gray-700">
        日期: <span class="font-medium">{{ event.decided_date || '' }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import cardImg from "~/assets/images/card.jpg";
import mandarinImg from "~/assets/images/mandarin.png";

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
.text-primary {
  color: #1d4ed8; /* Primary theme color */
}
.text-primary-dark {
  color: #1e3a8a; /* Darker primary theme color */
}
</style>