// 設定最終日期並決定活動
export async function updateEventFinalDate(eventId, date) {
  const { error } = await supabase
    .from("events")
    .update({
      status: "decided",
      confirm_start_date: date,
      confirm_end_date: date,
    })
    .eq("id", eventId);
  if (error) throw error;
}
export async function leaveEvent(eventId, userId) {
  const { error } = await supabase
    .from("events_members")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId);
  if (error) throw error;
}

import { supabase } from "./supabase";

//停用
// export async function fetchEventById(eventId) {
//   const { data, error } = await supabase
//     .from("events")
//     .select("*")
//     .eq("id", eventId)
//     .neq("status", "closed")
//     .order("id", { ascending: false })
//     .single();
//   if (error) throw error;
//   return data;
// }

export async function fetchEventByPublicCode(public_code) {
  const { data, error } = await supabase
    .from("events")
    .select(
      "*, users:owner_id(username), events_members(user_id, users(username)), availabilities(*)"
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
        status: "voting",
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

//landing page 取得 user 參加的所有 events
export async function fetchUserEventsByUserId(userId) {
  // 查詢 user 參加的所有 events
  const { data, error } = await supabase
    .from("events_members")
    .select("event_id, events(*, events_members(user_id, users(username)))")
    .order("id", { ascending: false })
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

export async function saveAvailabilities({
  user_id,
  event_id,
  available_dates,
}) {
  // 先刪除舊資料
  const { error: delError } = await supabase
    .from("availabilities")
    .delete()
    .eq("user_id", user_id)
    .eq("event_id", event_id);
  if (delError) throw delError;
  // 再插入新資料
  const { error: insError } = await supabase.from("availabilities").insert({
    user_id,
    event_id,
    available_dates,
  });
  if (insError) throw insError;
}

export async function closeEvent(eventId) {
  const { error: insError } = await supabase
    .from("events")
    .update({ status: "closed" })
    .eq("id", eventId);
  if (insError) throw insError;
}

// 整合更新 event 欄位 API
export async function updateEventFields(eventId, fields) {
  const { error } = await supabase
    .from("events")
    .update(fields)
    .eq("id", eventId);
  if (error) throw error;
}
