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
import { debounce } from "lodash-es";

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
      if (event.value) {
        if (event.value?.events_members) {
          members.value = event.value.events_members;
        } else {
          members.value = [];
        }
        if (!currentUser.value) {
          //如果還沒有 currentUser，才去嘗試從 localStorage 讀取
          await getCurrentUserLocal();
          console.log("getCurrentUserLocal");
        }
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
  });

  const getCurrentUserLocal = async () => {
    console.log("eventCode", eventCode);
    if (eventCode) {
      let userMap = {};
      try {
        let userMapString = await localStorage.getItem("eventUserMap");
        userMap = userMapString ? JSON.parse(userMapString) : {};
      } catch (e) {
        userMap = {};
      }
      const userId = userMap[eventCode];
      console.log("userMap", userMap);
      console.log("userId", userId);
      if (userId) {
        try {
          const user = await fetchEventMemberById(userId);
          if (user) {
            currentUser.value = user;
            console.log("user", user);
          } else {
            currentUser.value = null;
          }
        } catch (e) {
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

  const confirmFinalDate = async (payload) => {
    const { eventId, fields } = payload;
    const res = await updateEventFields(eventId, fields);
    if (res.data) {
      await fetchEvent();
    }
    return res;
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
    confirmFinalDate,
  };
}
