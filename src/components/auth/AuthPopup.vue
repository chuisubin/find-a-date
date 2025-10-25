<template>
  <div class="w-full md:w-80 max-w-screen-sm mx-auto">
    <div class="flex border-b border-gray-400  mb-4">
      <button :class="tabClass('login')" @click="activeTab = 'login'">登入</button>
      <button :class="tabClass('register')" @click="activeTab = 'register'">註冊</button>
    </div>
    <div  v-if="activeTab === 'login'">
      <Login @auth-success="emit('auth-success')" />
    </div>
    <div v-else>
      <Register @auth-success="emit('auth-success')" />
      </div>
  </div>
</template>




<script setup>
import { ref,  } from 'vue';
import { signIn, signUp,  } from '@/api/user';
import { toast } from 'vue3-toastify';
import Register from './Register.vue';
import Login from './Login.vue';
const emit = defineEmits(['close', 'auth-success']);

const activeTab = ref('login');



function tabClass(tab) {
  return [
    'flex-1 py-2 text-center font-semibold ',
    activeTab.value === tab ? 'border-b-4  border-primary-light dark:border-primary-dark  text-primary-light dark:text-primary-dark' : 'sub_title_color',
    'cursor-pointer',
  ].join(' ');
}


</script>
