<script setup>
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'

const route = useRoute()
</script>

<template>
 
    <!-- Componente de partículas como fondo -->
       
    <div class="relative z-10">
      <!-- Muestra el NavBar en las vistas correspondientes -->
      <NavBar v-if="!['Login','Register','Quiz'].includes(route.name)" />
      <RouterView />
    </div>

</template>