<template>
  <div class="min-h-screen flex bg-gray-50">

    <!-- panel kiri -->
    <div class="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-700 to-teal-500 flex-col justify-between p-12">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <span class="text-white font-semibold text-sm">Sistem Nilai</span>
      </div>

      <div>
        <h1 class="text-white text-4xl font-bold leading-tight mb-4">
          Sistem Pengolahan<br />Nilai Siswa
        </h1>
        <p class="text-teal-100 text-sm leading-relaxed mb-10">
          Platform manajemen nilai akademik yang terintegrasi untuk guru, siswa, dan administrator.
        </p>
        <div class="space-y-4">
          <div v-for="f in fitur" :key="f.label" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <component :is="f.icon" class="w-4 h-4 text-white" />
            </div>
            <div>
              <p class="text-white text-sm font-medium">{{ f.label }}</p>
              <p class="text-teal-200 text-xs mt-0.5">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <p class="text-teal-300 text-xs">© {{ tahun }} Sistem Pengolahan Nilai Akademik</p>
    </div>

    <!-- panel kanan -->
    <div class="w-full lg:w-1/2 flex items-center justify-center px-8">
      <div class="w-full max-w-sm">

        <!-- logo mobile -->
        <div class="lg:hidden flex items-center gap-2 mb-8">
          <div class="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <span class="font-semibold text-gray-800">Sistem Nilai</span>
        </div>

        <h2 class="text-2xl font-bold text-gray-800 mb-1">Selamat Datang</h2>
        <p class="text-sm text-gray-400 mb-8">Masukkan akun Anda untuk melanjutkan</p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Username</label>
            <input
              v-model="username"
              type="text"
              autocomplete="username"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition"
              placeholder="Masukkan username"
              required
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
            <div class="relative">
              <input
                v-model="password"
                :type="lihatPassword ? 'text' : 'password'"
                autocomplete="current-password"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition pr-11"
                placeholder="Masukkan password"
                required
              />
              <button type="button" @click="lihatPassword = !lihatPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg v-if="!lihatPassword" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="error"
            class="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-2">
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { loginService } from '../services/authService'

const router    = useRouter()
const auth      = useAuthStore()
const username  = ref('')
const password  = ref('')
const error     = ref('')
const loading   = ref(false)
const lihatPassword = ref(false)
const tahun     = new Date().getFullYear()

// icon komponen inline supaya tidak perlu library icon
const IkonBuku  = { render: () => h('svg', { fill:'none', stroke:'currentColor', 'stroke-width':'2', viewBox:'0 0 24 24' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', d:'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' })]) }
const IkonChart = { render: () => h('svg', { fill:'none', stroke:'currentColor', 'stroke-width':'2', viewBox:'0 0 24 24' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', d:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })]) }
const IkonUser  = { render: () => h('svg', { fill:'none', stroke:'currentColor', 'stroke-width':'2', viewBox:'0 0 24 24' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', d:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })]) }
const IkonShield= { render: () => h('svg', { fill:'none', stroke:'currentColor', 'stroke-width':'2', viewBox:'0 0 24 24' }, [h('path', { 'stroke-linecap':'round', 'stroke-linejoin':'round', d:'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })]) }

const fitur = [
  { label: 'Input & Kelola Nilai', desc: 'Guru menginput nilai tugas, UTS, dan UAS', icon: IkonBuku },
  { label: 'Rekap & Laporan PDF', desc: 'Ekspor laporan nilai dalam format PDF', icon: IkonChart },
  { label: 'Manajemen Pengguna', desc: 'Admin mengelola akun guru dan siswa', icon: IkonShield },
]


async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    const data = await loginService(username.value, password.value)
    auth.login({ id_user: data.id_user, username: data.username, role: data.role, nis: data.nis || null, id_guru: data.id_guru || null })
    if (data.role === 'admin') router.push('/admin')
    if (data.role === 'guru')  router.push('/guru')
    if (data.role === 'siswa') router.push('/siswa')
  } catch (err) {
    error.value = err.response?.data?.pesan || 'Username atau password salah'
  } finally {
    loading.value = false
  }
}
</script>
