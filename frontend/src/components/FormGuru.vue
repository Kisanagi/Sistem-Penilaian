<template>
  <form @submit.prevent="submit" class="space-y-3">
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">ID Guru</label>
        <input v-model="f.id_guru" :disabled="isEdit" placeholder="G001"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:bg-gray-50"
          required />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Nama Guru</label>
        <input v-model="f.nama_guru"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          required />
      </div>
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
        {{ isEdit ? 'Simpan' : 'Tambah Guru' }}
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
import { tambahGuru, editGuru } from '../services/guruService';

const props  = defineProps({ data: Object });
const emit   = defineEmits(['done']);
const isEdit = !!props.data?.id_guru;

const f = ref(isEdit
  ? { id_guru: props.data.id_guru, nama_guru: props.data.nama_guru, username: '', password: '' }
  : { id_guru: '', nama_guru: '', username: '', password: '' });

const err = ref('');

async function submit() {
  err.value = '';
  try {
    if (isEdit) {
      await editGuru(f.value.id_guru, { nama_guru: f.value.nama_guru });
    } else {
      await tambahGuru(f.value);
    }
    emit('done');
  } catch (e) {
    err.value = e.response?.data?.pesan || 'Gagal';
  }
}
</script>
