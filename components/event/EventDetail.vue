<template>
  <div class="mb-10">
    <div class="w-full">
      <div
        class="flex lg:flex-row justify-between items-start gap-4 w-full border-b mb-4"
        :class="!editing ? 'flex-row ' : 'flex-col lg:flex-row'"
      >
        <div class=" ">
          <h1
            class="whitespace-normal leading-normal mb-4 lg:mb-6 text-black dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold"
            v-if="!editing"
          >
            {{ event.title }}
          </h1>
          <input
            v-model="editedTitle"
            maxlength="20"
            type="text"
            placeholder="請輸入聚會標題"
            class="border p-2 mb-4 lg:mb-6 text-black dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold outline-none border-dashed border-primary-light dark:border-primary-dark bg-transparent w-full flex-shrink"
            v-else
          />
          <p
            v-if="!editing"
            class="mb-6 sub_title_color text-base lg:text-xl whitespace-pre-wrap"
          >
            {{ event.description }}
          </p>
          <textarea
            v-else
            v-model="editedDesc"
            maxlength="200"
            placeholder="請輸入聚會描述..."
            rows="3"
            class="p-2 border border-dashed border-primary-light dark:border-primary-dark bg-transparent outline-none w-full flex-shrink resize-none"
            :class="editing ? 'border' : ''"
            ref="descTextarea"
            @input="autoResizeDesc"
            :disabled="!editing"
          ></textarea>
        </div>
        <div class="w-full flex-1 relative">
          <div v-if="!editing" class="flex justify-end">
            <button
              v-if="isOwner && !editing && event.status === 'voting'"
              @click="startEdit"
              class="h-fit normal_btn flex flex-row items-center gap-2"
            >
              <font-awesome-icon
                :icon="['far', 'pen-to-square']"
                class="w-4 lg:w-5 lg:h-5"
              />
              <span class="hidden lg:block whitespace-nowrap">編輯</span>
            </button>
          </div>
          <div
            v-if="editing"
            class="relative flex flex-row gap-2 lg:gap-4 justify-end items-center"
          >
            <button
              @click="save"
              class="enter_btn btn flex flex-row items-center gap-2 whitespace-nowrap"
            >
              <font-awesome-icon
                :icon="['fa', 'check']"
                class="w-4 lg:w-5 lg:h-5"
              />
              <span class="hidden lg:block">保存</span>
            </button>
            <button
              @click="cancelEdit"
              class="cancel_btn btn flex flex-row items-center gap-2 whitespace-nowrap"
            >
              <font-awesome-icon
                :icon="['fa', 'xmark']"
                class="w-4 lg:w-5 lg:h-5"
              />
              <span class="hidden lg:block">取消</span>
            </button>
          </div>
        </div>
      </div>
      <div class="border-b pb-2 lg:pb-4 mb-4 flex flex-row items-center gap-2">
        <span class="">當前狀態:</span>
        <span
          v-if="event.status"
          class="px-3 py-1 rounded text-base font-semibold"
          :class="{
            'bg-blue-100 text-blue-700': event.status === 'voting',
            'bg-green-100 text-green-700': event.status === 'decided',
            'bg-gray-200 text-gray-600': event.status === 'closed',
          }"
        >
          {{
            event.status === "voting"
              ? "投票中"
              : event.status === "decided"
              ? "已決定"
              : event.status === "closed"
              ? "已結束"
              : event.status
          }}
          {{
            event.status === "decided" && event?.decided_date
              ? event.decided_date
              : ""
          }}
        </span>
      </div>
      <div class="border-b pb-2 lg:pb-4 mb-4 flex flex-row items-center gap-2">
        <span class="">報名截止日期:</span>
        <span class="text-error-light dark:text-error-dark">
          {{ deadlineViewText }}
        </span>
      </div>
      <div class="border-b pb-2 lg:pb-4 mb-4 flex flex-row items-center gap-2">
        <span class="">公開代碼:</span>
        <span>{{ event.public_code }}</span>
        <button
          @click="shareLinkHandle"
          class="copy-btn px-2 py-1 border rounded text-xs flex items-center gap-1"
          style="cursor: pointer"
        >
          <font-awesome-icon
            :icon="['fas', 'share']"
            class="w-5 h-5 text-primary-light"
          />
          分享連結
        </button>
      </div>
      <div class="flex justify-end" v-if="event.status==='decided'">
        <button
          @click="openInvitePopup"
          class="download_btn normal_btn flex flex-row items-center gap-2"
        >
          <span class="">生成邀請函</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Popup for Invitation -->
  <Popup v-model="showInvitePopup" @close="closeInvitePopup" :showClose="true">
    <div>
      <h1 class="text-center text-lg lg:text-2xl mb-4">預覽</h1>
      <div class="event-details relative    aspect-[3/2]  max-w-80  ">
        <Invitation  :event="event" />
      </div>
      <div class="popup-actions mt-4 flex justify-end gap-4">
        <button
          @click="downloadInvite"
          class="btn enter_btn "
        >
          下載
        </button>
        <button
          @click="shareInvite"
          class="btn enter_btn  items-center flex flex-row gap-2"
        >
        <font-awesome-icon
            :icon="['fas', 'share']"
            class="w-5 h-5"
          />
          分享
        </button>
      </div>
    </div>
  </Popup>
</template>

<script  setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { updateEventFields } from "~/api/event";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import html2canvas from "html2canvas";
import Popup from "~/components/Popup.vue";

import Invitation from "./Invitation.vue";
const props = defineProps({
  event: Object,
  isOwner: Boolean,
});
const event = computed(() => props.event);


const editing = ref(false);
const editedTitle = ref(event.value?.title || "");
const editedDesc = ref(event.value?.description || "");
const descTextarea = ref(null);

function startEdit() {
  editedTitle.value = event.value?.title || "";
  editedDesc.value = event.value?.description || "";
  editing.value = true;
  autoResizeDesc();
}
function cancelEdit() {
  editing.value = false;
}
function autoResizeDesc() {
  console.log("autoResizeDesc called");

  nextTick(() => {
    const el = descTextarea.value;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  });
}
async function save() {
  if (!editedTitle.value.trim() || !event.value?.id) return;
  try {
    await updateEventFields(event.value.id, {
      title: editedTitle.value.trim(),
      description: editedDesc.value,
    });
    event.value.title = editedTitle.value.trim();
    event.value.description = editedDesc.value;
    editing.value = false;
  } catch (e) {
    // 可加 toast
  }
}

const deadlineViewText = computed(() => {
  if (!event.value?.deadline_date) return "";
  const today = new Date();
  const deadline = new Date(event.value.deadline_date);
  const diffTime = deadline.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `剩餘 ${diffDays} 天`;
  if (diffDays === 0) return "今天截止";
  return "已截止";
});

const shareLinkHandle = () => {
  if (typeof window === 'undefined') return;
  
  const url = `${window.location.origin}/event/${event.value.public_code}`;
  navigator.clipboard.writeText(url);
  if (navigator.share) {
    navigator
      .share({
        title: "分享活動",
        url,
      })
      .catch(() => {});
  } else {
    // fallback: 複製連結
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert("連結已複製，可分享給朋友！");
    } else if (typeof document !== 'undefined') {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("連結已複製，可分享給朋友！");
    }
  }
};

const showInvitePopup = ref(false);

function openInvitePopup() {
  showInvitePopup.value = true;
}

function closeInvitePopup() {
  showInvitePopup.value = false;
}

async function downloadInvite() {
  const eventDetails = document.querySelector(".event-details");
  if (!eventDetails) {
    alert("未找到邀請函內容，無法生成圖片。");
    return;
  }

  try {
    const canvas = await html2canvas(eventDetails, {
      backgroundColor: "#fff",
      scale: 2, // Scale the image to double the resolution
    });
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `event-${event.value?.title || "details"}.png`;
    link.click();
  } catch (error) {
    console.error("生成圖片失敗：", error);
    alert("生成圖片失敗，請稍後重試。");
  }
}

async function shareInvite() {
  const eventDetails = document.querySelector(".event-details");
  if (!eventDetails) {
    alert("未找到邀請函內容，無法分享。");
    return;
  }

  try {
    const canvas = await html2canvas(eventDetails, {
      backgroundColor: "#fff",
      scale: 2, // Scale the image to double the resolution
    });
    const image = canvas.toDataURL("image/png");

    if (navigator.share) {
      navigator.share({
        title: "分享邀請函",
        text: `查看聚會邀請函：${event.value?.title}`,
        files: [
          new File([await (await fetch(image)).blob()], `event-${event.value?.title || "details"}.png`, {
            type: "image/png",
          }),
        ],
      });
    } else {
      alert("您的瀏覽器不支持分享功能，請手動下載圖片。");
    }
  } catch (error) {
    console.error("分享失敗：", error);
    alert("分享失敗，請稍後重試。");
  }
}
</script>

<style>
.event-details {
  font-family: 'Arial', sans-serif;
}
</style>
