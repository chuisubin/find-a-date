import { ref, computed, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
import { toast } from "vue3-toastify";
import { saveAvailabilities as saveAvailabilitiesApi } from "@/api/event";

export function useEventCalendar(props) {
  const userStore = useUserStore();

  const calendarRows = computed(() => {
    const start = props.event?.enable_start_date;
    const end = props.event?.enable_end_date;
    if (!start || !end) return 2;
    const [sy, sm] = start.split("-").map(Number);
    const [ey, em] = end.split("-").map(Number);
    return sy === ey && sm === em ? 1 : 2;
  });

  const userIdToUsername = computed(() => {
    const members = props.event?.events_members || [];
    const map = {};
    members.forEach((m) => {
      map[m.user_id] = m.users?.username || m.user_id;
    });
    return map;
  });

  const availabilities = computed(() => {
    return props.event?.availabilities || [];
  });

  const mySavedDates = computed(() => {
    const my = availabilities.value.find(
      (a) => a.user_id === userStore.user?.id
    );
    return my ? my.available_dates : [];
  });

  const selectedDates = ref(mySavedDates.value.slice());
  const isDatesModified = ref(false);

  watch(mySavedDates, (newDates) => {
    selectedDates.value = newDates.slice();
    isDatesModified.value = false;
  });

  const otherMembers = computed(() => {
    return availabilities.value.filter((a) => a.user_id !== userStore.user?.id);
  });

  const countColors = ["yellow", "orange", "red"];

  const calendarAttributes = computed(() => {
    const attrs = [];
    if (selectedDates.value.length) {
      attrs.push({
        key: "selected",
        dates: selectedDates.value,
        highlight: { color: "orange", fillMode: "light" },
        content: { color: "orange" },
      });
    }
    const dateCountMap = {};
    otherMembers.value.forEach((a) => {
      a.available_dates.forEach((date) => {
        dateCountMap[date] = (dateCountMap[date] || 0) + 1;
      });
    });
    Object.entries(dateCountMap).forEach(([date, count]) => {
      let colorIdx = 0;
      if (count >= 7) {
        colorIdx = countColors.length - 1;
      } else if (count >= 4) {
        colorIdx = 1;
      } else {
        colorIdx = 0;
      }
      const usernames = otherMembers.value
        .filter((a) => a.available_dates.includes(date))
        .map((a) => userIdToUsername.value[a.user_id] || a.user_id);
      attrs.push({
        key: `count_${date}`,
        dates: [date],
        popover: {
          label: `${usernames.join(", ")}`,
          visibility: "hover",
        },
        dot: { color: countColors[colorIdx] },
      });
    });
    return attrs;
  });

  const initialPage = computed(() => {
    const date = props.event?.enable_start_date;
    if (!date) return null;
    const [year, month] = date.split("-").map(Number);
    return { year, month };
  });

  const disabledDates = computed(() => {
    const start = props.event?.enable_start_date;
    const end = props.event?.enable_end_date;
    if (!start || !end) return [];
    const result = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    for (
      let d = new Date(2000, 0, 1);
      d < startDate;
      d.setDate(d.getDate() + 1)
    ) {
      result.push(d.toISOString().split("T")[0]);
    }
    for (
      let d = new Date(endDate.getTime() + 86400000);
      d < new Date(2100, 0, 1);
      d.setDate(d.getDate() + 1)
    ) {
      result.push(d.toISOString().split("T")[0]);
    }
    return result;
  });

  function handleSelect(day) {
    if (!userStore.user) {
      return;
    }
    const dateObj = day.date;
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;
    if (disabledDates.value.includes(dateStr)) return;
    const index = selectedDates.value.findIndex((d) => d === dateStr);
    if (index !== -1) {
      selectedDates.value.splice(index, 1);
    } else {
      selectedDates.value.push(dateStr);
    }
    isDatesModified.value =
      JSON.stringify(selectedDates.value.slice().sort()) !==
      JSON.stringify(mySavedDates.value.slice().sort());
  }

  async function saveAvailabilities() {
    if (!userStore.user || !props.event?.id) return;
    try {
      await saveAvailabilitiesApi({
        user_id: userStore.user.id,
        event_id: props.event.id,
        available_dates: selectedDates.value,
      });
      props.fetchEvent();
      toast.success("已保存可用日期");
      isDatesModified.value = false;
    } catch (e) {
      toast.error("保存失敗");
    }
  }
  const isJoinedMember = computed(() => {
    if (!userStore.user || !props.event) return false;
    return props.event.events_members.some(
      (m) => m.user_id === userStore.user?.id
    );
  });

  function cancelSelection() {
    selectedDates.value = (
      props.event?.availabilities?.find((a) => a.user_id === userStore.user?.id)
        ?.available_dates || []
    ).slice();
    isDatesModified.value = false;
  }
  return {
    calendarRows,
    userIdToUsername,
    otherMembers,
    calendarAttributes,
    initialPage,
    disabledDates,
    handleSelect,
    saveAvailabilities,
    selectedDates,
    isDatesModified,
    isJoinedMember,
    cancelSelection,
  };
}
