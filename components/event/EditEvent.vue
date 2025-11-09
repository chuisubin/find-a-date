<template>
  <div>
      <h1 class="text-center text-2xl lg:text-4xl font-bold mb-4">編輯聚會</h1>
      <form @submit.prevent="save">
        <div class="mb-4">
          <label class="block mb-1"
            >聚會標題 <span class="primary_text">*</span></label
          >
          <input
            placeholder="請輸入聚會標題"
            v-model="editedTitle"
            maxlength="20"
            type="text"
            class="input w-full"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block mb-1">地址</label>
          <input
            placeholder="請輸入聚會地址"
            v-model="editedAddress"
            maxlength="100"
            type="text"
            class="input w-full"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-1">聚會描述</label>
          <textarea
            v-model="editedDesc"
            maxlength="200"
            placeholder="請輸入聚會描述..."
            rows="4"
            class="input w-full resize-none"
          ></textarea>
        </div>

        <div v-if="errorMsg" class="mb-4 text-red-500 text-sm">
          {{ errorMsg }}
        </div>

        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="()=>emit('cancelEdit')"
            class="btn cancel_btn flex flex-row items-center gap-2 whitespace-nowrap"
          >
            取消
          </button>
          <button
            type="submit"
            class="enter_btn btn flex flex-row items-center gap-2 whitespace-nowrap"
          >
            保存
          </button>
        </div>
      </form>
    </div>
</template>

<script  setup>

import { ref } from "vue";
import { updateEventFields } from "~/api/event";
import { toast } from "vue3-toastify";

const props = defineProps({
  event: {
    type: Object,
        required: true,
    },
    fetchEvent: {
      type: Function,
      required: false,
    },
});
const emit = defineEmits(["cancelEdit"]);

const editedTitle = ref(props.event?.title || "");
const editedDesc = ref(props.event?.description || "");
const editedAddress = ref(props.event?.address || "");
const errorMsg = ref("");



async function save() {
  errorMsg.value = ""; // Clear previous error message
  if (!editedTitle.value.trim() || !props.event?.id) {
    errorMsg.value = "請輸入有效的聚會標題";
    return;
  }
  try {
    const res = await updateEventFields(props.event.id, {
      title: editedTitle.value.trim(),
      description: editedDesc.value,
      address: editedAddress.value.trim(), // Save the edited address
    });
    if (res.data) { // if update success
      await props.fetchEvent(); // fetch updated event details
      toast.success("編輯成功");
      errorMsg.value = "";
      emit("cancelEdit");
    } else {
      errorMsg.value = "編輯失敗，請稍後重試";
    }
  } catch (e) {
    errorMsg.value = "catch 發生錯誤，請稍後重試";
  }
}
</script>

<style>

</style>