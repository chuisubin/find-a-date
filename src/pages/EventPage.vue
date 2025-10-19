<template>
  <div class="max-w-xl mx-auto py-8 px-4">
    <h2 class="text-xl font-bold mb-4">Event Detail</h2>
    <div v-if="loading" class="text-gray-400">Loading...</div>
    <div v-else-if="event">
      <div class="card p-4 mb-4">
        <div class="font-semibold text-lg mb-2">{{ event.title }}</div>
        <div class="text-xs text-gray-400 mb-2">ID: {{ event.id }}</div>
        <div class="text-gray-600">Owner: {{ ownerName || event.owner_id }}</div>
        <div class="text-gray-600 mt-2">
          Members:
          <span v-if="members.length">{{ members.join(', ') }}</span>
          <span v-else>None</span>
        </div>
      </div>
      <EventRoleBar
        :userId="userStore.user?.id"
        :ownerId="event?.owner_id"
        :members="members"
        @join="handleJoin"
        @leave="handleLeave"
      />
    </div>
    <div v-else class="text-red-500">Event not found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';
import { fetchEventByPublicCode, fetchEventMembers, joinEvent } from '../api/event';
import EventRoleBar from '../components/EventRoleBar.vue';

const route = useRoute();
const event = ref(null);
const loading = ref(true);
const members = ref([]);
const ownerName = ref('');
const userStore = useUserStore();

async function fetchEvent() {
  loading.value = true;
  try {
    event.value = await fetchEventByPublicCode(route.params.code);
    if (event.value?.users) {
      ownerName.value = event.value.users.username || event.value.users.email || event.value.owner_id;
    } else {
      ownerName.value = event.value?.owner_id || '';
    }
    if (userStore.user && event.value?.id) {
      members.value = await fetchEventMembers(event.value.id);
    
    } else {
      members.value = [];
    }
  } catch (e) {
    event.value = null;
    members.value = [];
    ownerName.value = '';
  }
  loading.value = false;
}

  async function handleJoin() {
    if (!userStore.user) {
      alert('請先登入');
      return;
    }
    if (!event.value?.id) {
      alert('活動資料錯誤');
      return;
    }
    try {
      await joinEvent(event.value.id, userStore.user.id);
      // 重新取得成員列表
      members.value = await fetchEventMembers(event.value.id);
      alert('成功加入活動!');
    } catch (e) {
      alert('加入失敗: ' + (e.message || e));
    }
  }


onMounted(() => {
  fetchEvent();
});
</script>
