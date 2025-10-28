<template>
  <div class="mb-10">
    <div class="w-full">
      <div
        class="flex lg:flex-row justify-between items-start gap-4 w-full  border-b  mb-4"
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
            class="mb-6  sub_title_color text-base lg:text-xl whitespace-pre-wrap"
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
      <div class="border-b  pb-4 mb-4 flex flex-row items-center gap-2">
        
        <span class="">當前狀態:</span>
        <span
              v-if="event.status"
              class="  px-3 py-1 rounded text-base font-semibold"
              :class="{
                'bg-blue-100 text-blue-700': event.status === 'voting',
                'bg-green-100 text-green-700': event.status === 'decided',
                'bg-gray-200 text-gray-600': event.status === 'closed'
              }"
            >
              {{ event.status === 'voting' ? '投票中' : event.status === 'decided' ? '已決定' : event.status === 'closed' ? '已結束' : event.status }}
            </span>
  
    </div>
    <div class="border-b  pb-4 mb-4 flex flex-row items-center gap-2">
        <span class="">報名截止日期:</span>
          <span class="text-error-light dark:text-error-dark  ">
            {{ deadlineViewText }}
    </span>
    </div>

    </div>
  </div>

  <!-- <div class="text-xs mb-2">Code: {{ event.public_code }}</div> -->
  
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { updateEventFields } from "@/api/event";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps<{
  event: any;
  isOwner: boolean;
}>();
const event = ref(props.event);

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
  
</script>

<style></style>
