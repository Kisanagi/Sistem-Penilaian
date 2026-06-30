<template>
  <aside
    class="fixed top-0 left-0 h-screen w-56 bg-teal-700 flex flex-col z-10"
  >
    <!-- logo -->
    <div class="px-6 py-6 border-b border-teal-600">
      <p class="text-white font-bold text-lg leading-tight">Sistem Nilai</p>
      <p class="text-teal-200 text-xs mt-0.5">Pengolahan Nilai Akademik</p>
    </div>

    <!-- info user -->
    <div class="px-6 py-4 border-b border-teal-600">
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-semibold"
        >
          {{ initials }}
        </div>
        <div>
          <p class="text-white text-sm font-medium truncate w-32">
            {{ auth.user?.username }}
          </p>
          <p class="text-teal-300 text-xs capitalize">{{ auth.user?.role }}</p>
        </div>
      </div>
    </div>

    <!-- menu -->
    <nav class="flex-1 px-3 py-4 space-y-1">
      <button
        v-for="m in menus"
        :key="m.label"
        @click="$emit('change', m.label)"
        :class="[
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
          active === m.label
            ? 'bg-white text-teal-700'
            : 'text-teal-100 hover:bg-teal-600',
        ]"
      >
        {{ m.label }}
      </button>
    </nav>

    <!-- logout -->
    <div class="px-3 py-4 border-t border-teal-600">
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-teal-200 hover:bg-teal-600 hover:text-white transition-colors"
      >
        Keluar
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const props = defineProps({ active: String });
defineEmits(["change"]);

const auth = useAuthStore();
const router = useRouter();

const MENU = {
  admin: [
    { label: "Dashboard", icon: "dashboard" },
    { label: "Data Guru", icon: "guru" },
    { label: "Data Siswa", icon: "siswa" },
    { label: "Mata Pelajaran", icon: "mapel" },
    { label: "Laporan", icon: "laporan" },
  ],
  guru: [
    { label: "Input Nilai", icon: "input" },
    { label: "Rekap Nilai", icon: "rekap" },
  ],
  siswa: [{ label: "Nilai Saya", icon: "nilai" }],
};

const menus = computed(() => MENU[auth.user?.role] || []);
const initials = computed(
  () => auth.user?.username?.slice(0, 2).toUpperCase() || "??",
);

function handleLogout() {
  auth.logout();
  router.push("/login");
}
</script>
