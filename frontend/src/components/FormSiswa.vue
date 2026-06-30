<template>
  <form @submit.prevent="submit" class="space-y-3">
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">NIS</label>
        <input v-model="f.nis" :disabled="isEdit"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:bg-gray-50"
          required />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Kelas</label>
        <select v-model="f.kelas"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          required>
          <option value="">-- Pilih Kelas --</option>
          <option v-for="k in kelasList" :key="k" :value="k">{{ k }}</option>
          <option value="__baru__">+ Kelas Baru...</option>
        </select>
        <input v-if="f.kelas === '__baru__'" v-model="kelasBaru"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 mt-2"
          placeholder="Ketik nama kelas baru" autofocus />
      </div>
    </div>

    <div>
      <label class="block text-xs font-medium text-gray-600 mb-1">Nama Lengkap</label>
      <input v-model="f.nama"
        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        required />
    </div>

    <div v-if="!isEdit" class="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Username</label>
        <input v-model="f.username"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          required />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Password</label>
        <input v-model="f.password" type="password" placeholder="Min. 6 karakter"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          required />
      </div>
    </div>

    <p v-if="err" class="text-red-500 text-xs">{{ err }}</p>

    <div class="flex gap-2 pt-1">
      <button type="submit"
        class="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 text-sm rounded-lg font-medium">
        {{ isEdit ? 'Simpan' : 'Tambah Siswa' }}
      </button>
      <button type="button" @click="$emit('done')"
        class="flex-1 border border-gray-200 text-gray-600 py-2.5 text-sm rounded-lg hover:bg-gray-50">
        Batal
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getDaftarKelas, tambahSiswa, editSiswa } from '../services/siswaService';

const props  = defineProps({ data: Object });
const emit   = defineEmits(['done']);
const isEdit = !!props.data?.nis;

const f = ref(isEdit
  ? { nis: props.data.nis, nama: props.data.nama, kelas: props.data.kelas, username: '', password: '' }
  : { nis: '', nama: '', kelas: '', username: '', password: '' });

const kelasList = ref([]);
const kelasBaru = ref('');
const err       = ref('');

onMounted(async () => {
  kelasList.value = await getDaftarKelas().catch(() => []);
});

async function submit() {
  err.value = '';
  const kelasFinal = f.value.kelas === '__baru__' ? kelasBaru.value : f.value.kelas;
  if (!kelasFinal) return (err.value = 'Kelas tidak boleh kosong');
  try {
    if (isEdit) {
      await editSiswa(f.value.nis, { nama: f.value.nama, kelas: kelasFinal });
    } else {
      await tambahSiswa({ ...f.value, kelas: kelasFinal });
    }
    emit('done');
  } catch (e) {
    err.value = e.response?.data?.pesan || 'Gagal';
  }
}
</script>
