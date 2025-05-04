import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ProfileView from '@/views/ProfileView.vue';
import RankingView from '@/views/RankingView.vue';
import QuizView from '@/views/QuizView.vue';
import { useAuthStore } from '../stores/auth'; // para protección de rutas

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/profile', name: 'Profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/ranking', name: 'Ranking', component: RankingView, meta: { requiresAuth: true } },
  { path: '/quiz', name: 'Quiz', component: QuizView, meta: { requiresAuth: true } },
  { path: '/', redirect: '/quiz' }  // redirigir raíz al juego o login dependiendo de autenticación
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard global para rutas que requieren auth
router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login' };
  }
});
export default router;
