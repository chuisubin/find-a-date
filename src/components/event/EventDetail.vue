<template>
  <div class="mb-10">
    <div class="w-full">
      <div
        class="flex lg:flex-row justify-between items-start gap-4 w-full "
        :class="!editing?'flex-row ':'flex-col lg:flex-row'"
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
            class="border p-2 mb-4 lg:mb-6 text-black dark:text-white text-3xl md:text-5xl lg:text-6xl font-bold outline-none border-dashed border-primary-light dark:border-primary-dark bg-transparent w-full flex-shrink"
            v-else
          />
          <p
            v-if="!editing"
            class="mb-6 lg:mb-10 sub_title_color text-base lg:text-xl whitespace-pre-wrap"
          >
            {{ event.description }}
          </p>
          <textarea
            v-else
            v-model="editedDesc"
            maxlength="200"
            rows="3"
            class="p-2 border border-dashed border-primary-light dark:border-primary-dark bg-transparent outline-none w-full flex-shrink resize-none"
            :class="editing ? 'border' : ''"
            ref="descTextarea"
            @input="autoResizeDesc"
            :disabled="!editing"
          ></textarea>
        </div>
        <div class="w-full flex-1  relative ">
          <div v-if="!editing" class=" flex justify-end">
            <button
              v-if="isOwner && !editing && event.status === 'voting'"
              @click="startEdit"
              class="h-fit normal_btn flex flex-row items-center gap-2"
            >
              <font-awesome-icon
                :icon="['far', 'pen-to-square']"
                class="w-4  lg:w-6 lg:h-6 "
              />
              <span class="hidden lg:block">編輯</span>
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
              <font-awesome-icon :icon="['fa', 'check']" class="w-4  lg:w-6 lg:h-6 " />
              <span class="hidden lg:block">儲存</span>
            </button>
            <button
              @click="cancelEdit"
              class="cancel_btn btn flex flex-row items-center gap-2 whitespace-nowrap"
            >
              <font-awesome-icon :icon="['fa', 'xmark']" class="w-4  lg:w-6 lg:h-6 " />
              <span class="hidden lg:block">取消</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="bg-red-500 text-white text-center p-2 rounded-md ">
            {{ deadlineViewText }}
          </div> -->
  <!-- <div class="text-xs mb-2">Code: {{ event.public_code }}</div> -->
  <!-- <span
              v-if="event.status"
              class="px-3 py-1 rounded text-base font-semibold"
              :class="{
                'bg-blue-100 text-blue-700': event.status === 'voting',
                'bg-green-100 text-green-700': event.status === 'decided',
                'bg-gray-200 text-gray-600': event.status === 'closed'
              }"
            >
              {{ event.status === 'voting' ? '投票中' : event.status === 'decided' ? '已決定' : event.status === 'closed' ? '已結束' : event.status }}
            </span> -->
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
  autoResizeDesc()
}
function cancelEdit() {
  editing.value = false;
}
function autoResizeDesc() {
  nextTick(() => {
    const el = descTextarea.value;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
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
</script>

<style></style>
