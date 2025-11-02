import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import {
  fetchEventByPublicCode,
  updateEventFields,
  closeEvent,
  createEventMember,
  verifyEventMemberPin,
  fetchEventMemberById,
} from "~/api/event";
import { debounce } from "lodash";

export function useEvent() {
  const route = useRoute();
  const event = ref(null);
  const loading = ref(true);
  const members = ref([]);
  const eventCode = route.params.code;
  const currentUser = ref(null);

  const owner = computed(() => {
    return members.value.find((it) => it.role == "admin") ?? null;
  });
  const isOwner = computed(() => {
    return (
      (currentUser.value && owner.value?.id === currentUser.value.id) ?? false
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

  onMounted(async () => {
    debouncedFetchEvent();
    getCurrentUserLocal();
  });

  const getCurrentUserLocal = async () => {
    if (eventCode) {
      let userMap = {};
      try {
        let userMapString = await localStorage.getItem("eventUserMap");
        userMap = userMapString ? JSON.parse(userMapString) : {};
      } catch (e) {
        userMap = {};
      }
      const userId = userMap[eventCode];
      if (userId) {
        try {
          const user = await fetchEventMemberById(userId);
          if (user) {
            currentUser.value = user;
          } else {
            delete userMap[eventCode];
            localStorage.setItem("eventUserMap", JSON.stringify(userMap));
            currentUser.value = null;
          }
        } catch (e) {
          delete userMap[eventCode];
          localStorage.setItem("eventUserMap", JSON.stringify(userMap));
          currentUser.value = null;
        }
      }
    }
  };

  const confirmCloseEvent = async () => {
    await closeEvent(event.value.id);
    window.location.href = "/";
  };

  const createMember = async (payload) => {
    const res = await createEventMember(payload);
    if (res.data) {
      currentUser.value = res.data;
      // 只存 user.id
      let userMap = {};
      try {
        userMap = localStorage.getItem("eventUserMap")
          ? JSON.parse(localStorage.getItem("eventUserMap"))
          : {};
      } catch (e) {
        userMap = {};
      }
      userMap[eventCode] = res.data.id;
      localStorage.setItem("eventUserMap", JSON.stringify(userMap));
      //fetch event to update members list
      await fetchEvent();
    }
    return res;
  };

  const verifyPin = async (payload) => {
    const res = await verifyEventMemberPin(payload);
    console.log("data", res);

    if (res.data) {
      currentUser.value = res.data;
      // 只存 user.id
      let userMap = {};
      try {
        userMap = localStorage.getItem("eventUserMap")
          ? JSON.parse(localStorage.getItem("eventUserMap"))
          : {};
      } catch (e) {
        userMap = {};
      }
      userMap[eventCode] = res.data.id;
      localStorage.setItem("eventUserMap", JSON.stringify(userMap));
    }
    return res;
  };
  const cleanUser = async () => {
    let userMap = {};
    try {
      userMap = localStorage.getItem("eventUserMap")
        ? JSON.parse(localStorage.getItem("eventUserMap"))
        : {};
    } catch (e) {
      userMap = {};
    }
    if (userMap[eventCode]) {
      delete userMap[eventCode];
      localStorage.setItem("eventUserMap", JSON.stringify(userMap));
    }
    currentUser.value = null;
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
    cleanUser,
  };
}
