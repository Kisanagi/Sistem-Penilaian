<template>
  <div>
    <h1 class="text-xl font-bold text-gray-800 mb-6">Mata Pelajaran</h1>
    <div class="grid grid-cols-2 gap-6">

      <!-- kiri: daftar mapel -->
      <div>
        <div class="flex justify-between items-center mb-3">
          <p class="text-sm font-semibold text-gray-700">Daftar Mata Pelajaran</p>
          <button @click="$emit('tambahMapel')"
            class="bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium">
            + Tambah Mapel
          </button>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr class="text-xs text-gray-400 uppercase">
                <th v-for="h in ['ID','Nama Mapel','']" :key="h" class="text-left px-4 py-3 font-medium">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="daftarMapel.length === 0">
                <td colspan="3" class="text-center py-8 text-gray-300">Belum ada mata pelajaran</td>
              </tr>
              <tr v-for="m in daftarMapel" :key="m.id_mapel" class="border-t border-gray-50 hover:bg-gray-50">
                <td class="px-4 py-3 text-gray-400 text-xs">{{ m.id_mapel }}</td>
                <td class="px-4 py-3 font-medium text-gray-800">{{ m.nama_mapel }}</td>
                <td class="px-4 py-3 text-right space-x-3">
                  <button @click="$emit('editMapel', m)" class="text-teal-500 hover:text-teal-700 text-xs font-medium">Edit</button>
                  <button @click="$emit('hapusMapel', m.id_mapel)" class="text-red-400 hover:text-red-600 text-xs font-medium">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- kanan: penugasan guru -->
      <div>
        <div class="flex justify-between items-center mb-3">
          <p class="text-sm font-semibold text-gray-700">Penugasan Guru</p>
          <button @click="$emit('tambahPenugasan')"
            class="bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium">
            + Tambah Penugasan
          </button>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr class="text-xs text-gray-400 uppercase">
                <th v-for="h in ['Guru','Mapel','Kelas','']" :key="h" class="text-left px-4 py-3 font-medium">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="guruMapelList.length === 0">
                <td colspan="4" class="text-center py-8 text-gray-300">Belum ada penugasan guru</td>
              </tr>
              <tr v-for="gm in guruMapelList" :key="gm.id" class="border-t border-gray-50 hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-800">{{ gm.nama_guru }}</td>
                <td class="px-4 py-3 text-gray-500">{{ gm.nama_mapel }}</td>
                <td class="px-4 py-3 text-gray-500">{{ gm.kelas }}</td>
                <td class="px-4 py-3 text-right">
                  <button @click="$emit('hapusPenugasan', gm.id)" class="text-red-400 hover:text-red-600 text-xs font-medium">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ daftarMapel: Array, guruMapelList: Array })
defineEmits(['tambahMapel','editMapel','hapusMapel','tambahPenugasan','hapusPenugasan'])
</script>
