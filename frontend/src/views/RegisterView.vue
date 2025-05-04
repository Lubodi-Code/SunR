<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Datos del formulario (ya no se requiere email)
const username = ref('');
const password = ref('');
const maxUsernameLength = 15;

const submitForm = async () => {
  if (username.value.length > maxUsernameLength) {
    alert(`El nombre de usuario no puede tener más de ${maxUsernameLength} caracteres.`);
    return;
  }
  try {
    await authStore.register({ username: username.value, password: password.value });
    router.push('/quiz'); 
  } catch (err) {
    alert(err.message);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-navy-light">
    <form @submit.prevent="submitForm" class="bg-white p-6 rounded shadow-md w-full max-w-sm">
      <h1 class="text-2xl font-bold text-center mb-4 text-navy">Registro</h1>
      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">Nombre de usuario</label>
        <input v-model="username" type="text" required class="w-full px-3 py-2 border rounded" />
      </div>
      <div class="mb-6">
        <label class="block text-sm font-semibold mb-1">Contraseña</label>
        <input v-model="password" type="password" required class="w-full px-3 py-2 border rounded" />
      </div>
      <button type="submit" class="bg-blue-500 text-white w-full py-2 rounded font-semibold hover:bg-blue-600 transition-colors">
        Registrarse
      </button>
      <p class="mt-4 text-center text-sm">
        ¿Ya tienes cuenta? 
        <router-link to="/login" class="text-navy font-semibold hover:underline">Iniciar sesión</router-link>
      </p>
    </form>
  </div>
</template>