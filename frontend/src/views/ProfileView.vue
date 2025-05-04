<script setup>
import { useAuthStore } from '../stores/auth';
const authStore = useAuthStore();

// Usa el getter userName que ya procesa el username
const username = authStore.userName;
const score = authStore.user?.score ?? 0;

const logout = () => {
  authStore.logout();
  window.location.href = '/login';
};
</script>

<template>
  <div class="p-6 max-w-md mx-auto text-center">
    <h2 class="text-2xl font-bold text-navy mb-4">Perfil de {{ username }}</h2>
    <p class="text-lg mb-2">Puntaje actual: <span class="font-semibold">{{ score }}</span></p>
    <button @click="logout" class="mt-4 bg-red-600 text-white px-4 py-2 rounded">
      Cerrar sesión
    </button>
  </div>
</template>