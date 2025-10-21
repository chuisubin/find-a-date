<template>
  <div class="relative ">
    <div v-if="isOwner" class="px-4 py-2 rounded bg-green-600 text-white font-bold">搞手</div>
    <button v-else-if="isMember" class="px-4 py-2 rounded bg-red-500 text-white font-bold" @click="onLeave">退出</button>
    <button v-else class="px-4 py-2 rounded bg-blue-500 text-white font-bold" @click="onJoin">Join</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
  userId: String,
  ownerId: String,
  members: Array
});
const emit = defineEmits(['join', 'leave']);

const isOwner = computed(() => props.userId && props.userId === props.ownerId);
const isMember = computed(() => props.userId && props.members && props.members.some(m => m.user_id === props.userId));

function onJoin() {
  emit('join');
}
function onLeave() {
  emit('leave');
}
</script>
