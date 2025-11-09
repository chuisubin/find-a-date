<template>
  <div class="mb-10">
    <div class="w-full">
      <div
        class="flex  flex-row lg:flex-row justify-between items-start gap-4 w-full border-b mb-4"
      >
        <div class=" ">
          <h1
            class="whitespace-normal leading-normal mb-4 lg:mb-6 text-black dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold"
          :title="event.title"
          >
            {{ event.title }}
          </h1>
        </div>
        <div class="w-full flex-1 relative">
          <div  class="flex justify-end">
            <button
              v-if="isOwner && event.status === 'voting'"
              @click="()=>showEditPopup=true"
              class="h-fit normal_btn flex flex-row items-center gap-2"
            >
              <font-awesome-icon
                :icon="['far', 'pen-to-square']"
                class="w-4 lg:w-5 lg:h-5"
              />
              <span class="hidden lg:block whitespace-nowrap">編輯</span>
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
            'bg-status-voting-bg text-status-voting-text':
              event.status === 'voting',
            'bg-status-decided-bg text-status-decided-text':
              event.status === 'decided',
            'bg-status-closed-bg text-status-closed-text':
              event.status === 'closed',
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
        <div   @click="openSharePopup"  class="flex flex-row items-center gap-1 text-primary-light underline cursor-pointer px-1">
        <span>{{ event.public_code }}</span>
          <font-awesome-icon
            :icon="['fas', 'share']"
            class="w-4 h-4   inline-block"
           
          />
          </div>
      </div>
      <div class="border-b pb-2 lg:pb-4 mb-4 flex flex-row items-center gap-2">
        <span class="">地址:</span>
        <span class="">{{ event.address }}</span>
      </div>
      <div class="border-b pb-2 lg:pb-4 mb-4 flex flex-row items-start gap-2">
        <span class="">簡介:</span>
        <span
          class="mb-6  whitespace-pre-wrap"
        >
          {{ event.description }}
        </span>
      </div>

      <div class="flex justify-end" v-if="event.status === 'decided'">
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
      <div class="event-details relative aspect-[3/2] max-w-80">
        <Invitation :event="event" />
      </div>
      <div class="popup-actions mt-4 flex justify-end gap-4">
        <button @click="downloadInvite" class="btn enter_btn">下載</button>
        <button
          @click="shareInvite"
          class="btn enter_btn items-center flex flex-row gap-2"
        >
          <font-awesome-icon :icon="['fas', 'share']" class="w-5 h-5" />
          分享
        </button>
      </div>
    </div>
  </Popup>

  <!--Popup for Sharing-->
  <Popup v-model="showSharePopup" @close="closeSharePopup" :showClose="true">
    <div>
      <h1 class="text-center text-lg lg:text-2xl mb-4">分享活動</h1>
      <div class="flex flex-col gap-4">
        <p class="text-center">公開代碼: {{ event.public_code }}</p>
        <img :src="qrCodeData" alt="QR Code" class="mx-auto" />
        <button @click="shareLinkHandle" class="btn enter_btn">分享連結</button>
      </div>
    </div>
  </Popup>

  <!--Popup for editing event -->
  <Popup v-model="showEditPopup" @close="cancelEdit" :showClose="true">
   <EditEvent @cancelEdit="cancelEdit" :event="event" :fetchEvent="props.fetchEvent" />
  </Popup>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { updateEventFields } from "~/api/event";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import html2canvas from "html2canvas";
import Popup from "~/components/Popup.vue";
import { calculateDeadlineText } from "~/utils/dateFormat";
import QRCode from "qrcode";
import EditEvent from "./EditEvent.vue";
import Invitation from "./Invitation.vue";
const props = defineProps({
  event: Object,
  isOwner: Boolean,
  fetchEvent: Function,

});
const event = computed(() => props.event);

const showEditPopup = ref(false);

const descTextarea = ref(null);

function cancelEdit() {
  showEditPopup.value = false;
}


const deadlineViewText = computed(() =>
  calculateDeadlineText(event.value?.deadline_date)
);

const shareLinkHandle = () => {
  if (typeof window === "undefined") return;

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
    } else if (typeof document !== "undefined") {
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
          new File(
            [await (await fetch(image)).blob()],
            `event-${event.value?.title || "details"}.png`,
            {
              type: "image/png",
            }
          ),
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

const showSharePopup = ref(false);

function openSharePopup() {
  showSharePopup.value = true;
}

function closeSharePopup() {
  showSharePopup.value = false;
}

function generateQRCode(link) {
  const qrCanvas = document.createElement('canvas');
  QRCode.toCanvas(qrCanvas, link, { width: 200 });
  return qrCanvas.toDataURL();
}

const sharePopupLink = computed(() => `${window.location.origin}/event/${event.value.public_code}`);
const qrCodeData = computed(() => generateQRCode(sharePopupLink.value));
</script>

<style scoped>
.event-details {
  font-family: "Arial", sans-serif;
}
</style>
