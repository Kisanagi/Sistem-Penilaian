<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar :active="active" @change="active = $event" />

    <main class="ml-56 flex-1 p-8">

      <!-- notifikasi -->
      <div v-if="toast.msg" :class="['fixed top-5 right-5 text-sm px-4 py-2.5 rounded-lg shadow-lg z-50',
        toast.tipe === 'err' ? 'bg-red-500 text-white' : 'bg-gray-800 text-white']">
        {{ toast.msg }}
      </div>

      <!-- input nilai -->
      <div v-if="active === 'Input Nilai'" class="w-full">
        <h1 class="text-xl font-bold text-gray-800 mb-1">
          {{ sedangEdit ? 'Revisi Nilai Siswa' : 'Input Nilai Siswa' }}
        </h1>
        <p class="text-sm text-gray-400 mb-7">Masukkan nilai akademik siswa dengan teliti.</p>

        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <form @submit.prevent="handleSimpan" class="space-y-6">

            <!-- pilih mapel + kelas (dari penugasan guru) -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Mata Pelajaran & Kelas</label>
              <select v-model="form.id_guru_mapel"
                class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                required>
                <option value="">-- Pilih Mapel & Kelas --</option>
                <option v-for="m in guruMapelList" :key="m.id_guru_mapel" :value="m.id_guru_mapel">
                  {{ m.nama_mapel }} - {{ m.kelas }}
                </option>
              </select>
            </div>

            <!-- pilih siswa (otomatis sesuai kelas dari mapel yang dipilih) -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Siswa</label>
              <select v-model="form.nis"
                class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                :disabled="!form.id_guru_mapel"
                required>
                <option value="">-- Pilih Siswa --</option>
                <option v-for="s in daftarSiswa" :key="s.nis" :value="s.nis">{{ s.nama }}</option>
              </select>
              <p v-if="!form.id_guru_mapel" class="text-gray-400 text-xs mt-1">Pilih mapel & kelas terlebih dahulu</p>
            </div>

            <!-- input nilai -->
            <div class="grid grid-cols-3 gap-4">
              <div v-for="f in nilaiFields" :key="f.key">
                <label class="block text-xs font-medium text-gray-600 mb-1.5">{{ f.label }}</label>
                <input v-model.number="form[f.key]" type="number" min="0" max="100"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                  placeholder="0 - 100" required />
                <p v-if="form[f.key] > 100" class="text-red-500 text-xs mt-1">Nilai tidak boleh lebih dari 100</p>
                <p v-if="form[f.key] < 0" class="text-red-500 text-xs mt-1">Nilai tidak boleh kurang dari 0</p>
              </div>
            </div>

            <!-- preview nilai akhir -->
            <div v-if="preview !== null"
              :class="['rounded-xl p-4 flex items-center justify-between',
                preview >= 70 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200']">
              <div>
                <p class="text-xs font-medium text-gray-500">Preview Nilai Akhir</p>
                <p :class="['text-3xl font-bold mt-0.5', preview >= 70 ? 'text-green-700' : 'text-red-600']">
                  {{ preview }}
                </p>
              </div>
              <span :class="['px-3 py-1.5 rounded-full text-sm font-semibold',
                preview >= 70 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-700']">
                {{ preview >= 70 ? 'Lulus' : 'Tidak Lulus' }}
              </span>
            </div>

            <!-- peringatan duplikat -->
            <div v-if="pesanDuplikat"
              class="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-3 rounded-lg">
              {{ pesanDuplikat }}
              <button @click="active = 'Rekap Nilai'; muatRekap()" class="underline ml-1 font-medium">Lihat Rekap Nilai</button>
            </div>

            <!-- tombol -->
            <div class="flex gap-3 pt-1">
              <button type="submit" :disabled="!!pesanDuplikat"
                :class="['flex-1 py-2.5 text-sm font-semibold rounded-lg text-white',
                  pesanDuplikat ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700']">
                {{ sedangEdit ? 'Simpan Perubahan' : 'Simpan Nilai' }}
              </button>
              <button type="button" @click="batal"
                class="px-6 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50">
                Batal
              </button>
            </div>

          </form>
        </div>
      </div>

      <!-- rekap nilai -->
      <div v-if="active === 'Rekap Nilai'">
        <h1 class="text-xl font-bold text-gray-800 mb-6">Rekap Nilai</h1>

        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Mata Pelajaran</label>
            <select v-model="filterMapel"
              class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
              <option value="">Semua Mapel</option>
              <option v-for="m in [...new Map(guruMapelList.map(x => [x.id_mapel, x])).values()]" :key="m.id_mapel" :value="m.id_mapel">{{ m.nama_mapel }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Kelas</label>
            <select v-model="filterKelas"
              class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
              <option value="">Semua Kelas</option>
              <option v-for="k in daftarKelasGuru" :key="k" :value="k">{{ k }}</option>
            </select>
          </div>
          <button @click="muatRekap"
            class="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 text-sm rounded-lg font-medium">
            Tampilkan
          </button>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr class="text-xs text-gray-400 uppercase">
                <th v-for="h in ['Nama','Kelas','Mapel','Tugas','UTS','UAS','Nilai Akhir','Status','']"
                  :key="h" class="text-left px-4 py-3 font-medium">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="rekapNilai.length === 0">
                <td colspan="9" class="text-center py-10 text-gray-300">Tekan Tampilkan untuk memuat rekap</td>
              </tr>
              <tr v-for="n in rekapNilai" :key="n.id_nilai" class="border-t border-gray-50 hover:bg-gray-50">
                <td class="px-4 py-3.5 font-medium text-gray-800">{{ n.nama }}</td>
                <td class="px-4 py-3.5 text-gray-500">{{ n.kelas }}</td>
                <td class="px-4 py-3.5 text-gray-500">{{ n.nama_mapel }}</td>
                <td class="px-4 py-3.5 text-gray-600">{{ n.nilai_tugas }}</td>
                <td class="px-4 py-3.5 text-gray-600">{{ n.nilai_uts }}</td>
                <td class="px-4 py-3.5 text-gray-600">{{ n.nilai_uas }}</td>
                <td class="px-4 py-3.5 font-bold text-gray-800">{{ n.nilai_akhir }}</td>
                <td class="px-4 py-3.5">
                  <span :class="n.status === 'Lulus'
                    ? 'px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full'
                    : 'px-2.5 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full'">
                    {{ n.status }}
                  </span>
                </td>
                <td class="px-4 py-3.5 text-right">
                  <button @click="mulaiEdit(n)" class="text-teal-500 hover:text-teal-700 text-xs font-medium">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import Sidebar from '../components/Sidebar.vue';
import { getMapelMilik } from '../services/guruService';
import { getSiswaByKelas } from '../services/siswaService';
import { inputNilai, editNilai, getRekapNilai } from '../services/nilaiService';

const auth           = useAuthStore();
const active         = ref('Input Nilai');
const guruMapelList  = ref([]); // semua mapel+kelas yang diajar guru ini
const daftarSiswa    = ref([]);
const rekapNilai     = ref([]);
const sedangEdit     = ref(null);
const filterMapel    = ref('');
const filterKelas    = ref('');
const toast          = ref({ msg: '', tipe: 'ok' });

const form = ref({ nis: '', id_guru_mapel: '', nilai_tugas: '', nilai_uts: '', nilai_uas: '' });
const pesanDuplikat = ref('');

// kelas unik dari penugasan guru ini
const daftarKelasGuru = computed(() => [...new Set(guruMapelList.value.map(m => m.kelas))]);

// mapel yang tersedia berdasarkan kelas yang dipilih
const daftarMapelByKelas = computed(() => {
  if (!form.value.id_guru_mapel) return guruMapelList.value;
  return guruMapelList.value;
});

const nilaiFields = [
  { key: 'nilai_tugas', label: 'Tugas (30%)' },
  { key: 'nilai_uts',   label: 'UTS (30%)' },
  { key: 'nilai_uas',   label: 'UAS (40%)' },
];

const preview = computed(() => {
  const { nilai_tugas, nilai_uts, nilai_uas } = form.value;
  if (!nilai_tugas || !nilai_uts || !nilai_uas) return null;
  return Math.round(0.3 * Number(nilai_tugas) + 0.3 * Number(nilai_uts) + 0.4 * Number(nilai_uas));
});

function tampilToast(msg, tipe = 'ok') {
  toast.value = { msg, tipe };
  setTimeout(() => { toast.value = { msg: '', tipe: 'ok' }; }, 3000);
}

function batal() {
  sedangEdit.value    = null;
  pesanDuplikat.value = '';
  form.value = { nis: '', id_guru_mapel: '', nilai_tugas: '', nilai_uts: '', nilai_uas: '' };
  daftarSiswa.value   = [];
}

function mulaiEdit(n) {
  sedangEdit.value = n.id_nilai;
  form.value = { nis: n.nis, id_guru_mapel: String(n.id_guru_mapel), nilai_tugas: n.nilai_tugas, nilai_uts: n.nilai_uts, nilai_uas: n.nilai_uas };
  active.value = 'Input Nilai';
}

async function handleSimpan() {
  const payload = {
    nis: form.value.nis,
    id_guru_mapel: Number(form.value.id_guru_mapel),
    nilai_tugas: Number(form.value.nilai_tugas),
    nilai_uts:   Number(form.value.nilai_uts),
    nilai_uas:   Number(form.value.nilai_uas),
  };
  try {
    if (sedangEdit.value) {
      await editNilai(sedangEdit.value, payload);
      tampilToast('Nilai berhasil diperbarui');
      sedangEdit.value = null;
    } else {
      await inputNilai(payload);
      tampilToast('Nilai berhasil disimpan');
    }
    form.value = { nis: '', id_guru_mapel: '', nilai_tugas: '', nilai_uts: '', nilai_uas: '' };
    pesanDuplikat.value = '';
  } catch (err) {
    tampilToast(err.response?.data?.pesan || 'Gagal menyimpan', 'err');
  }
}

async function muatRekap() {
  const params = { id_guru: auth.user.id_guru };
  if (filterMapel.value) params.id_mapel = filterMapel.value;
  if (filterKelas.value) params.kelas    = filterKelas.value;
  try {
    rekapNilai.value = await getRekapNilai(params);
  } catch {
    tampilToast('Gagal memuat rekap', 'err');
  }
}

// saat pilih guru_mapel, muat siswa berdasarkan kelas dari pilihan tersebut
watch(() => form.value.id_guru_mapel, async (val) => {
  pesanDuplikat.value = '';
  if (!val || sedangEdit.value) return;
  const pilihan = guruMapelList.value.find(m => String(m.id_guru_mapel) === String(val));
  if (pilihan) daftarSiswa.value = await getSiswaByKelas(pilihan.kelas).catch(() => []);
});

// cek duplikat saat siswa berubah
watch(() => form.value.nis, async (nis) => {
  if (!nis || !form.value.id_guru_mapel || sedangEdit.value) { pesanDuplikat.value = ''; return; }
  const rekap = await getRekapNilai({ id_guru: auth.user.id_guru }).catch(() => []);
  const ada = rekap.find(n => n.nis === nis && String(n.id_guru_mapel) === String(form.value.id_guru_mapel));
  pesanDuplikat.value = ada ? 'Siswa ini sudah memiliki nilai untuk mata pelajaran tersebut. Gunakan fitur Edit untuk mengubah nilai.' : '';
});

onMounted(async () => {
  if (auth.user?.id_guru) guruMapelList.value = await getMapelMilik(auth.user.id_guru).catch(() => []);
});
</script>
