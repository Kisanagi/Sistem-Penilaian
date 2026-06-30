import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const tersimpan = localStorage.getItem('user');
  const user = ref(tersimpan ? JSON.parse(tersimpan) : null);

  function login(dataUser) {
    user.value = dataUser;
    localStorage.setItem('user', JSON.stringify(dataUser));
  }

  function logout() {
    user.value = null;
    localStorage.removeItem('user');
  }

  return { user, login, logout };
});
