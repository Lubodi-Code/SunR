import api from '../lib/axios';

export async function generateQuestion() {
  try {
    const res = await api.get('/generate-question');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
}

export async function submitAnswer({ questionId, answer }) {
  try {
    const res = await api.post('/submit-answer', { questionId, answer });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
}

export async function fetchRanking() {
  try {
    const res = await api.get('/ranking');
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
}