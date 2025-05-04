<script setup>
import { useQuizStore } from '../stores/quiz';
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

import QuestionCard from '../components/QuestionCard.vue'

const router = useRouter()
const quizStore = useQuizStore()

const question     = computed(() => quizStore.currentQuestion)
const answered     = computed(() => quizStore.userAnswer !== null)
const loading      = computed(() => quizStore.loading)
const pointsEarned = computed(() => quizStore.pointsEarned)
const isCorrect    = computed(() => quizStore.isCorrect)

const emojiRef = ref(null)

onMounted(() => {
  quizStore.loadNewQuestion()
})

// Cuando respondemos, animamos el emoji
watch(answered, async (val) => {
  if (val) {
    await nextTick()
    // pop/elastic
    gsap.fromTo(emojiRef.value,
      { scale: 0, opacity: 0 },
      { scale: 1.5, opacity: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' }
    )
    // y animamos el texto de resultado
    gsap.fromTo('.result-text',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4 }
    )
  }
})

const handleSelect = async (option, el) => {
  if (answered.value) return
  // pequeña animación de pulsar
  gsap.to(el, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 })
  await quizStore.answerQuestion(question.value.questionId, option)
}

const nextQuestion = () => quizStore.loadNewQuestion()
const retire       = () => router.push({ name: 'Ranking' })
</script>

<template>
  <div class="max-w-xl mx-auto p-4">
    <h2 class="text-2xl font-bold text-center mb-6 text-navy">Quiz Médico</h2>

    <!-- Tarjeta de pregunta -->
    <QuestionCard
      v-if="question"
      :question="question"
      :answered="answered"
      :userAnswer="quizStore.userAnswer"
      @select="handleSelect"
    />

    <!-- Mensaje de resultado + emoji -->
    <div v-if="answered" class="mt-6 text-center">
      <p
        class="result-text inline-block text-lg font-medium"
        :class="isCorrect ? 'text-green-600' : 'text-red-600'"
      >
        {{ isCorrect
          ? `¡Respuesta correcta! Ganaste ${pointsEarned} puntos.`
          : `Respuesta incorrecta. Perdiste ${-pointsEarned} puntos.` }}
        <span ref="emojiRef" class="ml-2 text-2xl inline-block">
          {{ isCorrect ? '😀' : '😢' }}
        </span>
      </p>
    </div>

    <div class="mt-4 space-x-4">
        <button
          @click="nextQuestion"
          class="px-4 py-2 bg-navy text-white rounded hover:bg-blue-900 transition"
        >
          Siguiente pregunta
        </button>
        <button
          @click="retire"
          class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          Retirarme y ver Ranking
        </button>
      </div>
      
    <p v-if="loading" class="mt-4 text-center animate-pulse">Cargando pregunta…</p>
  </div>
</template>
