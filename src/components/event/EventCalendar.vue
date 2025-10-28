<template>
  <div class="border p-4 rounded-lg">
    <!-- 持續展開的多選日曆 -->
    <v-calendar
      is-expanded
      :attributes="calendarAttributes"
      :multiple="true"
      @dayclick="handleSelect"
      borderless
      transparent
      expanded
      :initial-page="initialPage"
      :min-date="props.event.enable_start_date"
      :max-date="props.event.enable_end_date"
      :is-dark="isDark"
      title-position="left"
      :rows="calendarRows"
      :disabled-dates="disabledDates"
      
    >
    </v-calendar>
    <div class="flex gap-2 mt-2" v-if="isJoinedMember && isDatesModified">
      <button
        @click="saveAvailabilities"
        class="enter_btn btn flex flex-row items-center gap-2 whitespace-nowrap"
      >
        <font-awesome-icon :icon="['fa', 'check']" class="w-4 lg:w-5 lg:h-5" />
        <span class="hidden lg:block">保存</span>
      </button>
      <button
        @click="cancelSelection"
        class="cancel_btn btn flex flex-row items-center gap-2 whitespace-nowrap"
      >
        <font-awesome-icon :icon="['fa', 'xmark']" class="w-4 lg:w-5 lg:h-5" />
        <span class="hidden lg:block">取消</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
// user_id 對應 username 映射
import { useUserStore } from "@/stores/user";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
import { useEventCalendar } from "@/hooks/useEventCalendar";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  fetchEvent: {
    type: Function,
    required: true,
  },
});

const userStore = useUserStore();
const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);

const {
  calendarRows,

  calendarAttributes,
  initialPage,
  disabledDates,
  handleSelect,
  saveAvailabilities,
  isDatesModified,
  isJoinedMember,
  cancelSelection,
} = useEventCalendar(props);
</script>
<style >


.vc-pane-container .vc-highlights{
  border: 2px solid red;
}
</style>
