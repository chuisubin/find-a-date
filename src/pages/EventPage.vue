<template>
  <div class="max-w-7xl mx-auto py-4 px-4">
    <div v-if="loading" class="text-gray-400">Loading...</div>
    <div v-else-if="event">
      <div class="mb-4">
        <div class="   w-full">
          <div class="items-start justify-between flex flex-row">
          <div class="flex items-center gap-2 mb-2">
            <h1 v-if="!editingTitle" class="font-semibold text-5xl">
              {{ event.title }}
            </h1>
            <input
              v-else
              v-model="editedTitle"
              class="font-semibold text-5xl border-b border-gray-400 bg-transparent outline-none"
            />
            <button
              v-if="isOwner && !editingTitle"
              @click="startEditTitle"
              class="ml-2 px-2 py-1 text-sm rounded bg-yellow-400 hover:bg-yellow-500 text-white"
            >
              Edit
            </button>
            <button
              v-if="editingTitle"
              @click="saveTitle"
              class="ml-2 px-2 py-1 text-sm rounded bg-green-500 hover:bg-green-600 text-white"
            >
              Save
            </button>
            <button
              v-if="editingTitle"
              @click="cancelEditTitle"
              class="ml-1 px-2 py-1 text-sm rounded bg-gray-400 hover:bg-gray-500 text-white"
            >
              Cancel
            </button>
          </div>
          <div
            class="bg-red-500 text-white text-center p-2 rounded-md cursor-pointer"
            @click="toggleDeadlineView"
          >
            {{ deadlineViewText }}
          </div>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <p v-if="!editingDesc" class="mb-2 text-sm">
              {{ event.description }}
            </p>
            <textarea
              v-else
              v-model="editedDesc"
              class="mb-2 text-sm border-b border-gray-400 bg-transparent outline-none w-full no-scrollbar custom-no-resize"
              rows="1"
              ref="descTextarea"
              @input="autoResizeDesc"
            ></textarea>
            <button
              v-if="isOwner && !editingDesc"
              @click="startEditDesc"
              class="ml-2 px-2 py-1 text-sm rounded bg-yellow-400 hover:bg-yellow-500 text-white"
            >
              Edit
            </button>
            <button
              v-if="editingDesc"
              @click="saveDesc"
              class="ml-2 px-2 py-1 text-sm rounded bg-green-500 hover:bg-green-600 text-white"
            >
              Save
            </button>
            <button
              v-if="editingDesc"
              @click="cancelEditDesc"
              class="ml-1 px-2 py-1 text-sm rounded bg-gray-400 hover:bg-gray-500 text-white"
            >
              Cancel
            </button>
          </div>
          <div class="text-xs mb-2">Code: {{ event.public_code }}</div>
        </div>
        <EventCalendar
          :event="event"
        />
        <div class="mt-2 flex flex-row justify-between items-start">
          <div>
          參與者:
          <div class="flex flex-row gap-1 flex-wrap">
            <p
              v-for="member of members"
              :key="member.user_id"
              class="w-fit py-1 px-4"
              :class="
                member.user_id == owner.user_id
                  ? 'bg-green-600 text-white '
                  : ''
              "
            >
              <span v-if="member.user_id == owner.user_id" class="font-bold"
                >搞手:</span
              >
              {{ member.username }}
            </p>
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
      </div>
      <div></div>
      <!-- <div v-else class="text-red-500">Event not found.</div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
// v-calendar 必須已安裝: npm install v-calendar
// 若尚未在 main.js 註冊，請在 main.js 加入: import vcalendar from './plugins/vcalendar'; app.use(vcalendar);
import { useRoute } from "vue-router";
import { useUserStore } from "../stores/user";
import { fetchEventByPublicCode, joinEvent } from "../api/event";
import EventRoleBar from "../components/EventRoleBar.vue";
import { storeToRefs } from "pinia";
import { useThemeStore } from "../stores/theme";
import { toast } from "vue3-toastify";
import { updateEventTitle, updateEventDescription } from "../api/event";
import { supabase } from "../api/supabase";
// textarea 自動拉高高度
import { nextTick } from "vue";
import EventCalendar from "../components/event/EventCalendar.vue";


const descTextarea = ref(null);

function autoResizeDesc() {
  nextTick(() => {
    const el = descTextarea.value;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  });
}
const editingDesc = ref(false);
const editedDesc = ref("");

function startEditDesc() {
  editedDesc.value = event.value?.description || "";
  editingDesc.value = true;
}

function cancelEditDesc() {
  editingDesc.value = false;
}

async function saveDesc() {
  if (!event.value?.id) return;
  try {
    await updateEventDescription(event.value.id, editedDesc.value);
    event.value.description = editedDesc.value;
    toast.success("描述已更新");
    editingDesc.value = false;
  } catch (e) {
    toast.error("描述更新失敗");
  }
}

const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);



const route = useRoute();
const event = ref(null);
const loading = ref(true);
const members = ref([]);
const owner = ref(null);
const userStore = useUserStore();
const editingTitle = ref(false);
const editedTitle = ref("");


const isOwner = computed(() => {
  return (
    userStore.user && event.value && userStore.user.id === event.value.owner_id
  );
});
const showDeadlineAsDays = ref(true);
const toggleDeadlineView = () => {
  showDeadlineAsDays.value = !showDeadlineAsDays.value;
};

const deadlineViewText = computed(() => {
  if (!event.value?.deadline_date) return "";
  if (!showDeadlineAsDays.value) return event.value.deadline_date;
  // 計算剩餘天數
  const today = new Date();
  const deadline = new Date(event.value.deadline_date);
  // 計算相差毫秒數
  const diffTime = deadline.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `剩餘 ${diffDays} 天`;
  if (diffDays === 0) return "今天截止";
  return "已截止";
});



async function fetchEvent() {
  loading.value = true;
  try {
    event.value = await fetchEventByPublicCode(route.params.code);
    if (event.value?.events_members) {
      members.value = event.value.events_members.map((m) => ({
        user_id: m.user_id,
        username: m.users?.username,
        email: m.users?.email,
      }));

      owner.value =
        members.value.find((it) => it.user_id == event.value?.owner_id) ?? null;
    } else {
      owner.value = null;
      members.value = [];
    }
  } catch (e) {
    event.value = null;
    members.value = [];
    owner.value = null;
  }
  loading.value = false;
}

async function handleJoin() {
  if (!userStore.user) {
    userStore.openAuthPopup();
    return;
  }
  if (!event.value?.id) {
    alert("活動資料錯誤");
    return;
  }
  try {
    await joinEvent(event.value.id, userStore.user.id);
    // 1入到成員列表
    members.value.push({
      user_id: userStore.user.id,
      username: userStore.user.username,
      email: userStore.user.email,
    });

    alert("成功加入活動!");
  } catch (e) {
    alert("加入失敗: " + (e.message || e));
  }
}

const handleLeave = async () => {
  alert("Leave event functionality not implemented yet.");
};

onMounted(() => {
  fetchEvent();
});


function startEditTitle() {
  editedTitle.value = event.value?.title || "";
  editingTitle.value = true;
}
function cancelEditTitle() {
  editingTitle.value = false;
}

async function saveTitle() {
  if (!editedTitle.value.trim() || !event.value?.id) return;
  try {
    await updateEventTitle(event.value.id, editedTitle.value.trim());
    event.value.title = editedTitle.value.trim();
    toast.success("標題已更新");
    editingTitle.value = false;
  } catch (e) {
    toast.error("標題更新失敗");
  }
}
</script>

<style scoped>
.no-scrollbar {
  overflow: hidden !important;
}
.custom-no-resize {
  resize: none !important;
}
</style>
