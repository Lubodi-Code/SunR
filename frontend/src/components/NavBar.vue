<template>
    <nav
      class="sticky top-0 z-50 flex justify-between items-center px-6 py-3 bg-blue-800 text-white shadow-md"
    >
      <div class="flex items-center space-x-6">
        <RouterLink
          to="/quiz"
          class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
          active-class="bg-blue-700"
        >
          Quiz
        </RouterLink>
        <RouterLink
          to="/profile"
          class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
          active-class="bg-blue-700"
        >
          Profile
        </RouterLink>
        <RouterLink
          to="/ranking"
          class="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
          active-class="bg-blue-700"
        >
          Ranking
        </RouterLink>
      </div>
  
      <button
        @click="logout"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-sm font-medium transition"
      >
        Logout
      </button>
    </nav>
  </template>
  
  <script setup>
  import { useAuthStore } from '@/stores/auth'
  import { useRouter, RouterLink } from 'vue-router'
  
  const authStore = useAuthStore()
  const router = useRouter()
  
  const logout = () => {
    authStore.logout()
    router.push({ name: 'Login' })
  }
  </script>
  