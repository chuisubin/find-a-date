<template>
  <div class=" w-[350px]">
    <div class="flex border-b mb-4">
      <button :class="tabClass('login')" @click="activeTab = 'login'">Login</button>
      <button :class="tabClass('register')" @click="activeTab = 'register'">Register</button>
    </div>
    <form v-if="activeTab === 'login'" @submit.prevent="handleLogin">
      <div class="mb-4">
        <label class="block mb-1 text-gray-700 dark:text-gray-200">Email</label>
        <input v-model="login.email" class="input w-full " required type="email" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 text-gray-700 dark:text-gray-200">Password</label>
        <input v-model="login.password" type="password" class="input w-full " required />
      </div>
      <button type="submit" class="btn w-full ">Login</button>
      <div v-if="loginError" class="mt-2 text-red-500 dark:text-pink-400 text-sm">{{ loginError }}</div>
    </form>
    <form v-else @submit.prevent="handleRegister">
      <div class="mb-4">
        <label class="block mb-1 text-gray-700 dark:text-gray-200">Email</label>
        <input v-model="register.email" class="input w-full " required type="email" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 text-gray-700 dark:text-gray-200">Username</label>
        <input v-model="register.username" class="input w-full " required />
      </div>
      <div class="mb-4">
        <label class="block mb-1 text-gray-700 dark:text-gray-200">Password</label>
        <input v-model="register.password" type="password" class="input w-full " required />
      </div>
      <button type="submit" class=" w-full   btn ">Register</button>
      <div v-if="registerError" class="mt-2 text-red-500 dark:text-pink-400 text-sm">{{ registerError }}</div>
      <div v-if="registerSuccess" class="mt-2 text-green-600 dark:text-yellow-400 text-sm">{{ registerSuccess }}</div>
    </form>
  </div>
</template>




<script setup>
import { ref, defineEmits } from 'vue';
import { signIn, signUp, getCurrentUser } from '../api/supabase.js';
import { useUserStore } from '../stores/user';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const userStore = useUserStore();

const emit = defineEmits(['close', 'auth-success']);

const activeTab = ref('login');
const login = ref({ email: '', password: '' });
const register = ref({ email: '', username: '', password: '' });
const loginError = ref('');
const registerError = ref('');
const registerSuccess = ref('');



function tabClass(tab) {
  return [
    'flex-1 py-2 text-center font-semibold',
    activeTab.value === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500',
    'cursor-pointer',
  ].join(' ');
}

async function handleLogin() {
  loginError.value = '';
  try {
    const { error } = await signIn(login.value.email, login.value.password);
    if (error) {
      loginError.value = error.message || 'Login failed';
    } else {
      loginError.value = '';
  toast.success('Login successful!');
      // 取得 user 資料並存入 pinia
      const { data } = await getCurrentUser();
        console.log("data",data );
        userStore.setUser(data?.user || null);
        emit('auth-success');
   
    }
  } catch (err) {
    loginError.value = 'Network error';
  }
}

async function handleRegister() {
  registerError.value = '';
  registerSuccess.value = '';
  try {
    // Supabase Auth 只支援 email/password 註冊
    const { error } = await signUp(register.value.email, register.value.password);
    if (error) {
      registerError.value = error.message || 'Register failed';
    } else {
      registerError.value = '';
      registerSuccess.value = 'Register successful!';
      register.value = { email: '', username: '', password: '' };
      setTimeout(() => emit('auth-success'), 200);
    }
    // 如需儲存 username，註冊後可再寫入 profile table
  } catch (err) {
    registerError.value = 'Network error';
  }
}
</script>
