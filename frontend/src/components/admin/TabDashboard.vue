<template>
  <div>
    <h1 class="text-xl font-bold text-gray-800 mb-6">Dashboard</h1>
    <div class="grid grid-cols-4 gap-4 mb-8">
      <div v-for="card in statCards" :key="card.label"
        :class="['rounded-xl border border-gray-100 shadow-sm p-5', card.color]">
        <p class="text-3xl font-bold">{{ card.value }}</p>
        <p class="text-xs font-medium mt-1 opacity-75">{{ card.label }}</p>
      </div>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 class="font-semibold text-gray-700 mb-4">Daftar Siswa Terbaru</h2>
      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs text-gray-400 uppercase border-b border-gray-100">
            <th v-for="h in ['NIS','Nama','Kelas','Username']" :key="h" class="text-left pb-3 font-medium">{{ h }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="daftarSiswa.length === 0">
            <td colspan="4" class="py-8 text-center text-gray-300">Belum ada data siswa</td>
          </tr>
          <tr v-for="s in daftarSiswa.slice(0, 5)" :key="s.nis" class="border-b border-gray-50 hover:bg-gray-50">
            <td class="py-3 font-mono text-xs text-gray-400">{{ s.nis }}</td>
            <td class="py-3 font-medium text-gray-800">{{ s.nama }}</td>
            <td class="py-3 text-gray-500">{{ s.kelas }}</td>
            <td class="py-3 text-gray-400">{{ s.username }}</td>
          </tr>
        </tbody>
      </table>
      <button v-if="daftarSiswa.length > 5" @click="$emit('pindah', 'Data Siswa')"
        class="mt-3 text-xs text-teal-500 hover:underline">
        Lihat semua {{ daftarSiswa.length }} siswa →
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ daftarSiswa: Array, statCards: Array })
defineEmits(['pindah'])
</script>
