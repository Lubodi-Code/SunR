// src/store/quiz.js
import { defineStore } from 'pinia';
import { generateQuestion, submitAnswer, fetchRanking } from '@/services/QuestionApi.js';
import { useAuthStore } from '../stores/auth.js';

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    currentQuestion: null,   // { id, text, options: [...], ... }
    userAnswer: null,        // respuesta seleccionada por el usuario
    isCorrect: null,         // resultado de la respuesta (true/false)
    loading: false,
    ranking: []              // lista de usuarios para ranking
  }),
  actions: {
    async loadNewQuestion() {
      this.loading = true;
      const question = await generateQuestion(); // llama /api/generate-question
      this.currentQuestion = question;
      this.userAnswer = null;
      this.isCorrect = null;
      this.loading = false;
    },
    async answerQuestion(questionId, option) {
      if (!questionId) return;
      this.userAnswer = option;
      console.log('Pregunta id recibido:', questionId);
      // Enviar respuesta al backend utilizando questionId
      const result = await submitAnswer({
        questionId, // se usa el parámetro recibido
        answer: option
      });
      // Se actualiza el estado con la respuesta devuelta por la API
      this.isCorrect = result.correcta;
      this.pointsEarned = result.puntosGanados;
      // Actualizar el puntaje en AuthStore (usuario) sumando lo ganado
      const authStore = useAuthStore();
      if (authStore.user) {
        authStore.user.score += result.puntosGanados;
      }
      // Cargar siguiente pregunta después de un breve retraso
      setTimeout(() => {
        this.loadNewQuestion();
      }, 1000);
    },
    async loadRanking() {
      const data = await fetchRanking(); // llama /api/ranking
      this.ranking = Array.isArray(data) ? data : data.users

    }
  }
  
});
