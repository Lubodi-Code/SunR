<script setup>
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import gsap from 'gsap'
import { useQuizStore } from '@/stores/quiz.js'

const quizStore = useQuizStore()
const listRef   = ref(null)

onMounted(async () => {
  await quizStore.loadRanking().catch(err => console.error(err))
})

// Cuando cambie el ranking, animamos los <li>
watch(
  () => quizStore.ranking,
  async (newList) => {
    if (newList.length && listRef.value) {
      await nextTick()
      gsap.from(
        listRef.value.children,
        {
          y: -20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        }
      )
    }
  },
  { immediate: true }
)

const ranking = computed(() => quizStore.ranking)
</script>

<template>
  <div class="max-w-md mx-auto p-4">
    <h2
      class="text-2xl font-bold text-center text-navy mb-4"
      ref="titleRef"
    >
      🏆 Ranking General
    </h2>
    <ul
      v-if="ranking.length"
      ref="listRef"
      class="bg-white shadow rounded divide-y divide-gray-200 overflow-hidden"
    >
      <li
        v-for="(user, index) in ranking"
        :key="user.username"
        class="p-2 flex justify-between"
      >
        <span>{{ index + 1 }}. {{ user.username }}</span>
        <span class="font-semibold">{{ user.score }}</span>
      </li>
    </ul>
    <p v-else class="text-center animate-pulse">Cargando ranking...</p>
  </div>
</template>
