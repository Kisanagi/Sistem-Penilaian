import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import Login          from '../pages/Login.vue';
import AdminDashboard from '../pages/AdminDashboard.vue';
import GuruDashboard  from '../pages/GuruDashboard.vue';
import SiswaDashboard from '../pages/SiswaDashboard.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/admin', component: AdminDashboard, meta: { role: 'admin' } },
  { path: '/guru',  component: GuruDashboard,  meta: { role: 'guru'  } },
  { path: '/siswa', component: SiswaDashboard, meta: { role: 'siswa' } },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// navigation guard — cek login dan role sebelum masuk halaman
router.beforeEach((to) => {
  const auth = useAuthStore();
  const user = auth.user;

  if (to.path === '/login') return true;
  if (!user) return '/login';

  if (to.meta.role && to.meta.role !== user.role) {
    if (user.role === 'admin') return '/admin';
    if (user.role === 'guru')  return '/guru';
    if (user.role === 'siswa') return '/siswa';
  }

  return true;
});

export default router;
