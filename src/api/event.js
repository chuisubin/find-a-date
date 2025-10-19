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
    .select(
      "*, users:owner_id(username, email), events_members(user_id, users(username, email))"
    )
    .eq("public_code", public_code)
    .limit(1)
    .single();
  if (error) throw error;
  return data;
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

export async function fetchUserEventsByUserId(userId) {
  // 查詢 user 參加的所有 events
  const { data, error } = await supabase
    .from("events_members")
    .select(
      "event_id, events(*, events_members(user_id, users(username, email)))"
    )
    .eq("user_id", userId);
  if (error) throw error;
  const events = data?.map((item) => item.events) || [];

  return events;
}

export async function joinEvent(eventId, userId) {
  const { data, error } = await supabase
    .from("events_members")
    .insert([{ event_id: eventId, user_id: userId }]);
  console.log("joinEvent response data", data);
  if (error) throw error;
  return data;
}
