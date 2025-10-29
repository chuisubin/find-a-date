<template>
  <div>
    <form  @submit.prevent="handleRegister">
      <div class="mb-4">
        <label class="block mb-1  ">電子郵件</label>
  <input v-model="register.email" placeholder="請輸入電子郵件(唔洗驗證)" class="input w-full " required type="email" autocomplete="email" />
      </div>
      <div class="mb-4">
        <label class="block mb-1  ">使用者名稱</label>
        <input v-model="register.username" placeholder="請輸入使用者名稱" class="input w-full " required autocomplete="username"/>
      </div>
      <div class="mb-4 relative">
        <label class="block mb-1 ">密碼</label>
        <input
          v-model="register.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="請輸入密碼"
          class="input w-full pr-10"
          required
          autocomplete="new-password"
        />
        <span class="absolute right-3 top-9 cursor-pointer" @click="showPassword = !showPassword">
          <font-awesome-icon :icon="showPassword ? ['far', 'eye-slash'] : ['far', 'eye']" />
        </span>
      </div>
      <div class="mb-4 relative">
        <label class="block mb-1 ">再次輸入密碼</label>
        <input
          v-model="register.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="請再次輸入密碼"
          class="input w-full pr-10"
          required
          autocomplete="new-password"
        />
        <span class="absolute right-3 top-9 cursor-pointer" @click="showConfirmPassword = !showConfirmPassword">
          <font-awesome-icon :icon="showConfirmPassword ? ['far', 'eye-slash'] : ['far', 'eye']" />
        </span>
      </div>
  <button type="submit" :disabled="isLoading" class="enter_btn btn w-full">註冊</button>
      <div v-if="registerError" class="mt-2 error_text">{{ registerError }}</div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { signIn, signUp } from '@/api/user';
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const register = ref({ email: '', username: '', password: '', confirmPassword: '' });
const registerError = ref('');
const isLoading = ref(false);
const emit = defineEmits([ 'auth-success']);

async function handleRegister() {
  isLoading.value = true;
  registerError.value = '';
  if (register.value.password !== register.value.confirmPassword) {
    registerError.value = '密碼不一致，請確認兩次輸入的密碼相同';
    return;
  }
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
      register.value = { email: '', username: '', password: '', confirmPassword: '' };
      toast.success('Register successful!');

      emit('auth-success');
    }
    // 如需儲存 username，註冊後可再寫入 profile table
  } catch (err) {
    registerError.value = 'Network error';
  } finally {
    isLoading.value = false;
  }
}

</script>

<style>

</style>