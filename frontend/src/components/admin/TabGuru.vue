<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold text-gray-800">Data Guru</h1>
      <button @click="$emit('tambah')"
        class="bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2 rounded-lg font-medium">
        + Tambah Guru
      </button>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr class="text-xs text-gray-400 uppercase">
            <th v-for="h in ['ID','Nama Guru','Username','']" :key="h" class="text-left px-5 py-3 font-medium">{{ h }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="daftarGuru.length === 0">
            <td colspan="4" class="text-center py-10 text-gray-300">Belum ada data guru</td>
          </tr>
          <tr v-for="g in daftarGuru" :key="g.id_guru" class="border-t border-gray-50 hover:bg-gray-50">
            <td class="px-5 py-3.5 font-mono text-xs text-gray-400">{{ g.id_guru }}</td>
            <td class="px-5 py-3.5 font-medium text-gray-800">{{ g.nama_guru }}</td>
            <td class="px-5 py-3.5 text-gray-400">{{ g.username }}</td>
            <td class="px-5 py-3.5 text-right space-x-3">
              <button @click="$emit('edit', g)" class="text-teal-500 hover:text-teal-700 text-xs font-medium">Edit</button>
              <button @click="$emit('hapus', g.id_guru)" class="text-red-400 hover:text-red-600 text-xs font-medium">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({ daftarGuru: Array })
defineEmits(['tambah', 'edit', 'hapus'])
</script>
