<template>
  <form @submit.prevent="submit" class="space-y-3">
    <div>
      <label class="block text-xs font-medium text-gray-600 mb-1">Nama Mata Pelajaran</label>
      <input v-model="f.nama_mapel"
        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        required />
    </div>

    <p v-if="err" class="text-red-500 text-xs">{{ err }}</p>

    <div class="flex gap-2 pt-1">
      <button type="submit"
        class="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 text-sm rounded-lg font-medium">
        {{ isEdit ? 'Simpan' : 'Tambah Mapel' }}
      </button>
      <button type="button" @click="$emit('done')"
        class="flex-1 border border-gray-200 text-gray-600 py-2.5 text-sm rounded-lg hover:bg-gray-50">
        Batal
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/authService';

const props  = defineProps({ data: Object });
const emit   = defineEmits(['done']);
const isEdit = !!props.data?.id_mapel;

const f   = ref({ nama_mapel: props.data?.nama_mapel || '' });
const err = ref('');

async function submit() {
  err.value = '';
  try {
    if (isEdit) {
      await api.put(`/mapel/${props.data.id_mapel}`, f.value);
    } else {
      await api.post('/mapel', f.value);
    }
    emit('done');
  } catch (e) {
    err.value = e.response?.data?.pesan || 'Gagal';
  }
}
</script>
