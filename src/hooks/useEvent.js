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
  const themeStore = useThemeStore();
  const { isDark } = storeToRefs(themeStore);
  const route = useRoute();
  const event = ref(null);
  const loading = ref(true);
  const members = ref([]);
  const owner = ref(null);
  const userStore = useUserStore();

  const isOwner = computed(() => {
    return (
      userStore.user &&
      event.value &&
      userStore.user.id === event.value.owner_id
    );
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
    themeStore,
    isDark,
    route,
    event,
    loading,
    members,
    owner,
    userStore,
    isOwner,
    fetchEvent,
    handleJoin,
    handleLeave,
    confirmCloseEvent,
  };
}
