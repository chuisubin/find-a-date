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

export async function fetchUserEvents(userId) {
  // 透過 events_members 關聯表查詢 user 參加的所有 events
  console.log("fetchUserEvents userId", userId);
  const { data, error } = await supabase
    .from("events_members")
    .select("event_id, events(*)");
  // .eq("user_id", userId);
  if (error) throw error;
  // 回傳 events 資料
  return data?.map((item) => item.events) || [];
}

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
