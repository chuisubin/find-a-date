import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import {
  fetchEventByPublicCode,
  joinEvent,
  leaveEvent,
  updateEventFields,
  closeEvent,
} from "@/api/event";
import { storeToRefs } from "pinia";
import { useThemeStore } from "@/stores/theme";
import { toast } from "vue3-toastify";
import { debounce } from "lodash";
import { nextTick } from "vue";

export function useEvent() {
  const showConfirmDatePopup = ref(false);
  const confirmDate = ref("");
  const confirming = ref(false);
  const themeStore = useThemeStore();
  const { isDark } = storeToRefs(themeStore);
  const route = useRoute();
  const event = ref(null);
  const loading = ref(true);
  const members = ref([]);
  const owner = ref(null);
  const userStore = useUserStore();

  const topDates = computed(() => {
    if (!event.value || !event.value.availabilities) return [];
    const dateCount = {};
    event.value.availabilities.forEach((a) => {
      (a.available_dates || []).forEach((date) => {
        dateCount[date] = (dateCount[date] || 0) + 1;
      });
    });
    const arr = Object.entries(dateCount).map(([date, count]) => ({
      date,
      count,
    }));
    if (!arr.length) return [];
    const maxCount = Math.max(...arr.map((item) => item.count));
    return arr
      .filter((item) => item.count === maxCount)
      .sort((a, b) => a.date.localeCompare(b.date));
  });

  const isOwner = computed(() => {
    return (
      userStore.user &&
      event.value &&
      userStore.user.id === event.value.owner_id
    );
  });

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

  function openConfirmDate(date) {
    confirmDate.value = date;
    showConfirmDatePopup.value = true;
  }

  async function confirmFinalDate() {
    if (!event.value?.id || !confirmDate.value) return;
    confirming.value = true;
    try {
      await updateEventFields(event.value.id, {
        status: "decided",
        confirm_start_date: confirmDate.value,
        confirm_end_date: confirmDate.value,
      });
      event.value.status = "decided";
      event.value.confirm_date_start = confirmDate.value;
      event.value.confirm_date_end = confirmDate.value;
      toast.success("已設定最終日期");
      showConfirmDatePopup.value = false;
    } catch (e) {
      toast.error("設定失敗");
    } finally {
      confirming.value = false;
    }
  }

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
          members.value.find((it) => it.user_id == event.value?.owner_id) ??
          null;
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
      toast.error("活動資料錯誤");
      return;
    }
    try {
      await joinEvent(event.value.id, userStore.user.id);
      await fetchEvent();
      toast.success("成功加入活動!");
    } catch (e) {
      toast.error("加入失敗: " + (e.message || e));
    }
  }

  const handleLeave = async () => {
    if (!userStore.user) {
      userStore.openAuthPopup();
      return;
    }
    if (!event.value?.id) {
      toast.error("活動資料錯誤");
      return;
    }
    try {
      await leaveEvent(event.value.id, userStore.user.id);
      const idx = members.value.findIndex(
        (m) => m.user_id === userStore.user.id
      );
      if (idx !== -1) {
        members.value.splice(idx, 1);
      }
      await fetchEvent();
      toast.success("已離開活動!");
    } catch (e) {
      toast.error("離開失敗: " + (e.message || e));
    }
  };

  const debouncedFetchEvent = debounce(fetchEvent, 1000);

  watch(
    () => userStore.user,
    () => {
      debouncedFetchEvent();
    },
    { immediate: true }
  );

  const confirmCloseEvent = async () => {
    await closeEvent(event.value.id);
    window.location.href = "/";
  };

  return {
    showConfirmDatePopup,
    confirmDate,
    confirming,
    themeStore,
    isDark,
    route,
    event,
    loading,
    members,
    owner,
    userStore,
    topDates,
    isOwner,
    deadlineViewText,
    openConfirmDate,
    confirmFinalDate,
    fetchEvent,
    handleJoin,
    handleLeave,
    confirmCloseEvent,
  };
}
