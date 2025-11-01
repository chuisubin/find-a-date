import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import {
  fetchEventByPublicCode,
  updateEventFields,
  closeEvent,
  createEventMember,
  verifyEventMemberPin,
} from "@/api/event";
import { storeToRefs } from "pinia";
import { useThemeStore } from "@/stores/theme";
import { toast } from "vue3-toastify";
import { debounce } from "lodash";
import { nextTick } from "vue";

export function useEvent() {
  const route = useRoute();
  const event = ref(null);
  const loading = ref(true);
  const members = ref([]);
  const eventId = route.params.code;
  const currentUser = ref(null);

  const owner = computed(() => {
    return members.value.find((it) => it.role == "admin") ?? null;
  });
  const isOwner = computed(() => {
    return (
      (currentUser.value && owner.value.id === currentUser.value.id) ?? false
    );
  });

  async function fetchEvent() {
    loading.value = true;
    try {
      event.value = await fetchEventByPublicCode(route.params.code);
      if (event.value?.events_members) {
        members.value = event.value.events_members;
      } else {
        members.value = [];
      }
    } catch (e) {
      event.value = null;
      members.value = [];
    }
    loading.value = false;
  }

  const debouncedFetchEvent = debounce(fetchEvent, 1000);

  onMounted(() => {
    debouncedFetchEvent();

    if (eventId) {
      let userMap = {};
      try {
        userMap = localStorage.getItem("eventUserMap")
          ? JSON.parse(localStorage.getItem("eventUserMap"))
          : {};
      } catch (e) {
        userMap = {};
      }
      currentUser.value = userMap[eventId] || null;
    }
  });

  const confirmCloseEvent = async () => {
    await closeEvent(event.value.id);
    window.location.href = "/";
  };

  const createMember = async (payload) => {
    const data = await createEventMember(payload);
    if (data) {
      currentUser.value = data;
      // 存到 localStorage
      userMap[eventId] = data;
      localStorage.setItem("eventUserMap", JSON.stringify(userMap));
    }
    return data;
  };

  const verifyPin = async (payload) => {
    const data = await verifyEventMemberPin(payload);
    if (data) {
      currentUser.value = data;
      // 存到 localStorage
      userMap[eventId] = data;
      localStorage.setItem("eventUserMap", JSON.stringify(userMap));
    }
    return data;
  };

  return {
    event,
    loading,
    members,
    owner,
    currentUser,
    isOwner,
    fetchEvent,
    confirmCloseEvent,
    createMember,
    verifyPin,
  };
}
