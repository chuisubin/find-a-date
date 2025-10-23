<template>
<div class="my-2 border p-1 border-gray-300 rounded">
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
    <button @click="saveAvailabilities" class="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600">Save</button>
    <button @click="cancelSelection" class="px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-500">Cancel</button>
  </div>
        </div>
</template>

<script lang="ts" setup>

// user_id 對應 username 映射
import { useUserStore } from '@/stores/user';
import { useThemeStore } from '@/stores/theme';
import { storeToRefs } from "pinia";
    import { useEventCalendar } from '@/hooks/useEventCalendar';
const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  fetchEvent: {
    type: Function,
    required: true
  }
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
      cancelSelection
    } = useEventCalendar(props);

</script>
<style scoped>  </style>