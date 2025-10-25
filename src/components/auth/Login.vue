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
    <div class="mb-4 relative">
      <label class="block mb-1">密碼</label>
      <input
        v-model="login.password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="請輸入密碼"
        class="input w-full pr-10"
        required
        autocomplete="current-password"
      />
      <span class="absolute right-3 top-9 cursor-pointer" @click="showPassword = !showPassword">
        <font-awesome-icon :icon="showPassword ? ['far', 'eye-slash'] : ['far', 'eye']" />
      </span>
    </div>
    <button type="submit" class="enter_btn btn w-full"
    :disabled="isLoading"
    >登入</button>
    <div
      v-if="loginError"
      class="mt-2 error_text "
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
const showPassword = ref(false);
const emit = defineEmits([ 'auth-success']);


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
    } 

        isLoading.value = false;
    
}
</script>

<style></style>
