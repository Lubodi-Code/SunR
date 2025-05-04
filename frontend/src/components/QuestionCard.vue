<template>
    <div ref="container" class="p-4 border rounded shadow-md bg-white">
      <h2 class="text-lg font-bold mb-3">{{ question.pregunta }}</h2>
      <div class="space-y-2">
        <button
          v-for="(texto, key) in question.opciones"
          :key="key"
          @click="onClick(key, $event.target)"
          class="option-btn w-full text-left px-4 py-2 border rounded transition-colors"
          :class="getOptionClass(key)"
        >
          <strong>{{ key }}:</strong> {{ texto }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import gsap from 'gsap'
  
  const props = defineProps({
    question:    Object,
    answered:    Boolean,
    userAnswer:  String
  })
  const emit = defineEmits(['select'])
  const container = ref(null)
  
  onMounted(() => {
    // Animación de entrada de opciones
    gsap.from(container.value.querySelectorAll('.option-btn'), {
      y: -20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.4,
      ease: 'power2.out'
    })
  })
  
  function onClick(optionKey, target) {
    emit('select', optionKey, target)
  }
  
  function getOptionClass(optionKey) {
    if (!props.answered) return 'hover:bg-gray-100'
    // resaltados tras responder
    if (props.userAnswer === optionKey && optionKey === props.question.correctAnswer)
      return 'bg-green-200'
    if (props.userAnswer !== props.question.correctAnswer && optionKey === props.question.correctAnswer)
      return 'bg-green-200'
    if (props.userAnswer === optionKey && optionKey !== props.question.correctAnswer)
      return 'bg-red-200'
    return ''
  }
  </script>
  