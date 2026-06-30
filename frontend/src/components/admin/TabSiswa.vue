<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold text-gray-800">Data Siswa</h1>
      <button @click="$emit('tambah')"
        class="bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2 rounded-lg font-medium">
        + Tambah Siswa
      </button>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr class="text-xs text-gray-400 uppercase">
            <th v-for="h in ['NIS','Nama','Kelas','Username','']" :key="h" class="text-left px-5 py-3 font-medium">{{ h }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="daftarSiswa.length === 0">
            <td colspan="5" class="text-center py-10 text-gray-300">Belum ada data siswa</td>
          </tr>
          <tr v-for="s in daftarSiswa" :key="s.nis" class="border-t border-gray-50 hover:bg-gray-50">
            <td class="px-5 py-3.5 font-mono text-xs text-gray-400">{{ s.nis }}</td>
            <td class="px-5 py-3.5 font-medium text-gray-800">{{ s.nama }}</td>
            <td class="px-5 py-3.5 text-gray-500">{{ s.kelas }}</td>
            <td class="px-5 py-3.5 text-gray-400">{{ s.username }}</td>
            <td class="px-5 py-3.5 text-right space-x-3">
              <button @click="$emit('edit', s)" class="text-teal-500 hover:text-teal-700 text-xs font-medium">Edit</button>
              <button @click="$emit('hapus', s.nis)" class="text-red-400 hover:text-red-600 text-xs font-medium">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({ daftarSiswa: Array })
defineEmits(['tambah', 'edit', 'hapus'])
</script>
