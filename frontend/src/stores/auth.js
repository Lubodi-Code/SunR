// src/store/auth.js
import { defineStore } from 'pinia';
import { registerUser, loginUser, fetchUserProfile } from '@/services/AuthApi';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,       // objeto usuario (ej. { username, email, score })
    token: null,      // token JWT para peticiones autenticadas
    status: null      // estado de petición (cargando/éxito/error) opcional para UI
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.username || ''
  },
  actions: {
    async register(credentials) {
      // credentials: { username, email, password }
      const response = await registerUser(credentials); // llama /api/auth/register
      if (response.success) {
        // Registro exitoso, podríamos guardar usuario/token o redirigir a login
        this.user = response.user;
        this.token = response.token;
      } else {
        throw new Error(response.error || 'Error registrando usuario');
      }
    },
    async login(credentials) {
      const response = await loginUser(credentials); // llama /api/auth/login
      if (response.success) {
        this.user = response.user;
        this.token = response.token;
        // Opcional: guardar token en localStorage para persistencia
        localStorage.setItem('token', this.token);
        // Después de login exitoso, podríamos obtener perfil/score actual:
        await this.getProfile();
      } else {
        throw new Error(response.error || 'Credenciales inválidas');
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      // Podríamos también navegar a /login si se desea
    },
    async getProfile() {
      if (!this.token) return;
      const profile = await fetchUserProfile(this.token); // llama /api/score
      // Asumimos que /api/score retorna { username, score, ... }
      this.user = profile;
      if (profile.error) {
        throw new Error(profile.error || 'Error obteniendo perfil de usuario');
      }
    }
  }
});
