import axios from 'axios';

// buat instance axios dengan baseURL agar tidak perlu tulis URL lengkap berulang
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// fungsi untuk login — kirim username dan password ke backend
export async function loginService(username, password) {
  const res = await api.post('/auth/login', { username, password });
  return res.data; // { id_user, username, role, nis?, id_guru? }
}

// ekspor instance api agar bisa dipakai service lain
export default api;
