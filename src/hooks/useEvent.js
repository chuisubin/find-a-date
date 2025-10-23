import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import {
  fetchEventByPublicCode,
  joinEvent,
  leaveEvent,
  updateEventTitle,
  updateEventDescription,
  updateEventFinalDate,
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
  const descTextarea = ref(null);
  const editingDesc = ref(false);
  const editedDesc = ref("");
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
      await updateEventFinalDate(event.value.id, confirmDate.value);
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

  function autoResizeDesc() {
    nextTick(() => {
      const el = descTextarea.value;
      if (el) {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      }
    });
  }

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

  const confirmCloseEvent = async () => {
    await closeEvent(event.value.id);
    window.location.href = "/";
  };

  return {
    showConfirmDatePopup,
    confirmDate,
    confirming,
    descTextarea,
    editingDesc,
    editedDesc,
    themeStore,
    isDark,
    route,
    event,
    loading,
    members,
    owner,
    userStore,
    editingTitle,
    editedTitle,
    topDates,
    isOwner,
    deadlineViewText,
    openConfirmDate,
    confirmFinalDate,
    autoResizeDesc,
    startEditDesc,
    cancelEditDesc,
    saveDesc,
    fetchEvent,
    handleJoin,
    handleLeave,
    startEditTitle,
    cancelEditTitle,
    saveTitle,
    confirmCloseEvent,
  };
}
