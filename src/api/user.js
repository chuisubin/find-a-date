import { supabase } from "./supabase";

export async function signUp(payload) {
  const { email, password, username } = payload;
  // 註冊 Auth 帳號
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: username },
    },
  });
  if (error || !data?.user) return { data, error };

  // 同步寫入 users table
  const userProfile = {
    id: data.user.id,
    email,
    username,
    password,
    created_at: new Date().toISOString(),
  };
  const { error: dbError } = await supabase.from("users").insert([userProfile]);

  return { data, error: error || dbError };
}

export async function signIn(payload) {
  let { email, password } = payload;
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  return await supabase.auth.getUser();
}
