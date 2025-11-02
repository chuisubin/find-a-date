import { supabase } from "./supabase";

// 設定最終日期並決定活動
export async function updateEventFinalDate(eventId, date) {
  const { error } = await supabase
    .from("events")
    .update({
      status: "decided",
      decided_date: date,
    })
    .eq("id", eventId);
  if (error) throw error;
}

//event page主要CALL此API
export async function fetchEventByPublicCode(public_code) {
  const { data, error } = await supabase
    .from("events")
    .select(
      "*,  events_members(id,username,role,avatar_name), availabilities(*)"
    )
    .eq("public_code", public_code)
    .limit(1)
    .single();
  if (error) throw error;
  return data;
}

//event page create event API
export async function createEvent({
  title,
  description,
  deadline_date,
  enable_start_date,
  enable_end_date,
}) {
  //  建立 event
  const { data, error } = await supabase
    .from("events")
    .insert([
      {
        title,
        deadline_date,
        enable_start_date,
        enable_end_date,
        description,
        status: "voting",
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveAvailabilities({
  events_member_id,
  event_id,
  available_dates,
}) {
  // 先刪除舊資料
  const { error: delError } = await supabase
    .from("availabilities")
    .delete()
    .eq("events_member_id", events_member_id)
    .eq("event_id", event_id);
  if (delError) throw delError;
  // 再插入新資料
  const { error: insError } = await supabase.from("availabilities").insert({
    events_member_id,
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

//event page create event member API
export async function createEventMember(payload) {
  //join event member
  const { event_id, username, pin, avatar_name } = payload;
  const res = await supabase
    .from("events_members")
    .insert([{ event_id, username, pin, avatar_name }])
    .select()
    .single();
  return res;
}

export async function verifyEventMemberPin(payload) {
  const { event_id, id, pin } = payload;
  const res = await supabase
    .from("events_members")
    .select("*")
    .eq("event_id", event_id)
    .eq("id", id)
    .eq("pin", pin)
    .limit(1)
    .single();
  return res;
}

//根據local storage的id取得member資料
export async function fetchEventMemberById(id) {
  const { data, error } = await supabase
    .from("events_members")
    .select("id,username,avatar_name,role")
    .eq("id", id)
    .limit(1)
    .single();
  if (error) throw error;
  return data;
}
