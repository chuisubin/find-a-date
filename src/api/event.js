import { supabase } from "./supabase";

export async function fetchEventById(eventId) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchEventByPublicCode(public_code) {
  const { data, error } = await supabase
    .from("events")
    .select("*, users:owner_id(username, email)")
    .eq("public_code", public_code)
    .single();
  if (error) throw error;
  return data;
}

// export async function fetchUserEvents(userId) {
//   // 透過 events_members 關聯表查詢 user 參加的所有 events
//   console.log("fetchUserEvents userId", userId);
//   const { data, error } = await supabase
//     .from("events_members")
//     .select("event_id, events(*)");
//   // .eq("user_id", userId);
//   if (error) throw error;
//   // 回傳 events 資料
//   return data?.map((item) => item.events) || [];
// }

export async function createEvent({
  title,
  description,
  owner_id,
  deadline_date,
  enable_start_date,
  enable_end_date,
  max_members = null,
}) {
  const { data, error } = await supabase
    .from("events")
    .insert([
      {
        title,
        owner_id,
        deadline_date,
        enable_start_date,
        enable_end_date,
        description,
        max_members,
      },
    ])
    .select();
  if (error) throw error;
  // 新增 owner 為 events_members 成員
  const eventId = data?.[0]?.id;
  if (eventId && owner_id) {
    await supabase
      .from("events_members")
      .insert([{ event_id: eventId, user_id: owner_id }]);
  }
  return data;
}

export async function fetchEventsMemberCounts(eventIds) {
  if (!eventIds || eventIds.length === 0) return {};
  const { data, error } = await supabase
    .from("events_members")
    .select("event_id")
    .in("event_id", eventIds);
  if (error) throw error;
  // 統計每個 event_id 的 member 數
  const counts = {};
  for (const item of data) {
    counts[item.event_id] = (counts[item.event_id] || 0) + 1;
  }
  return counts;
}

export async function fetchUserEventsWithMemberCount(userId) {
  // 查詢 user 參加的所有 events
  const { data, error } = await supabase
    .from("events_members")
    .select("event_id, events(*)")
    .eq("user_id", userId);
  if (error) throw error;
  const events = data?.map((item) => item.events) || [];
  const eventIds = events.map((e) => e.id);
  // 查詢所有 event 的 member 數
  const memberCounts = await fetchEventsMemberCounts(eventIds);
  // 整合 member 數到 events
  for (const event of events) {
    event.member_count = memberCounts[event.id] || 1;
  }
  return events;
}

export async function fetchEventMembers(eventId) {
  const { data, error } = await supabase
    .from("events_members")
    .select("user_id, users(username, email)")
    .eq("event_id", eventId);
  if (error) throw error;
  // 回傳 user name/email 陣列
  return data.map(
    (item) => item.users?.username || item.users?.email || item.user_id
  );
}
