import api from '../lib/axios';

export async function registerUser({ username, email, password }) {
  try {
    const res = await api.post('/register', { username, email, password });
    return { success: true, user: res.data.user, token: res.data.token };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || error.message };
  }
}

export async function loginUser({ username, password }) {
  try {
    const res = await api.post('/login', { username, password });
    return { success: true, user: res.data.user, token: res.data.token };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || error.message };
  }
}

export async function fetchUserProfile(token) {
  try {
    const res = await api.get('/score', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
}