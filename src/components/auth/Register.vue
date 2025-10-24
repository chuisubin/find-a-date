<template>
  <div>
    <form  @submit.prevent="handleRegister">
      <div class="mb-4">
        <label class="block mb-1  ">電子郵件</label>
  <input v-model="register.email" placeholder="請輸入電子郵件" class="input w-full " required type="email" autocomplete="email" />
      </div>
      <div class="mb-4">
        <label class="block mb-1  ">使用者名稱</label>
        <input v-model="register.username" placeholder="請輸入使用者名稱" class="input w-full " required autocomplete="username"/>
      </div>
      <div class="mb-4">
        <label class="block mb-1 ">密碼</label>
  <input v-model="register.password" placeholder="請輸入密碼" type="password" class="input w-full " required autocomplete="new-password" />
      </div>
  <button type="submit" class="enter_btn btn w-full">註冊</button>
      <div v-if="registerError" class="mt-2 text-red-500 dark:text-pink-400 text-sm">{{ registerError }}</div>
      <div v-if="registerSuccess" class="mt-2 text-green-600 dark:text-yellow-400 text-sm">{{ registerSuccess }}</div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { signIn, signUp,  } from '@/api/user';
import { ref,  } from 'vue';
import { toast } from 'vue3-toastify';
const register = ref({ email: '', username: '', password: '' });
const registerError = ref('');
const registerSuccess = ref('');

async function handleRegister() {
  registerError.value = '';
  registerSuccess.value = '';
  try {
    // Supabase Auth 只支援 email/password 註冊
    let payload = {
      email: register.value.email,
      password: register.value.password,
      username: register.value.username
    }
  const { error } = await signUp(payload);
    if (error) {
      registerError.value = error.message || 'Register failed';
    } else {
      registerError.value = '';
      registerSuccess.value = 'Register successful!';
      register.value = { email: '', username: '', password: '' };
      toast.success('Register successful!');

      emit('auth-success');
    }
    // 如需儲存 username，註冊後可再寫入 profile table
  } catch (err) {
    registerError.value = 'Network error';
  }
}

</script>

<style>

</style>