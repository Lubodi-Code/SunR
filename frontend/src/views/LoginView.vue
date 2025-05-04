<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const username = ref(''); // Cambiado de "name" a "username"
const password = ref('');

const submitForm = async () => {
  try {
    await authStore.login({ username: username.value, password: password.value });
    router.push('/ranking');
  } catch (err) {
    alert('Error: ' + err.message);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-navy-light">
    <form @submit.prevent="submitForm" class="bg-white p-6 rounded shadow-md w-full max-w-sm">
      <h1 class="text-2xl font-bold text-center mb-4 text-navy">Iniciar Sesión</h1>
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">Nombre</label>
        <input v-model="username" type="text" required class="w-full px-3 py-2 border rounded" />
      </div>
      <div class="mb-6">
        <label class="block text-sm font-semibold mb-1">Contraseña</label>
        <input v-model="password" type="password" required class="w-full px-3 py-2 border rounded" />
      </div>
      <button type="submit" class="bg-gradient-to-r from-blue-400 to-indigo-600 text-white w-full py-2 rounded font-semibold hover:from-blue-500 hover:to-indigo-700 transition-colors">
        Entrar
      </button>
      <p class="mt-4 text-center text-sm">
        ¿No tienes cuenta? 
        <router-link to="/register" class="text-navy font-semibold hover:underline">Regístrate</router-link>
      </p>
    </form>
  </div>
</template>