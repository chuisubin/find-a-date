<template>
  <form @submit.prevent="handleLogin">
    <div class="mb-4">
      <label class="block mb-1">電子郵件</label>
      <input
        v-model="login.email"
        placeholder="請輸入電子郵件"
        class="input w-full"
        required
        type="email"
        autocomplete="email"
      />
    </div>
    <div class="mb-4">
      <label class="block mb-1">密碼</label>
      <input
        v-model="login.password"
        placeholder="請輸入密碼"
        type="password"
        class="input w-full"
        required
        autocomplete="current-password"
      />
    </div>
    <button type="submit" class="enter_btn btn w-full"
    :disabled="isLoading"
    >登入</button>
    <div
      v-if="loginError"
      class="mt-2 text-error-light dark:text-error-dark text-sm"
    >
      {{ loginError }}
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { signIn, signUp } from "@/api/user";
import { toast } from "vue3-toastify";
const login = ref({ email: "", password: "" });
const loginError = ref("");
const isLoading = ref(false);


async function handleLogin() {
    isLoading.value = true;
  loginError.value = "";
    try {
        let payload = {
            email: login.value.email,
            password: login.value.password,
        };
        const { error } = await signIn(payload);
        if (error) {
            loginError.value = error.message || "Login failed";
        } else {
            loginError.value = "";

            toast.success("Login successful!");
            // 取得 user 資料並存入 pinia
            emit("auth-success");
        }
    } catch (err) {
        loginError.value = "Network error";
    } finally {

        isLoading.value = false;
    }
}
</script>

<style></style>
