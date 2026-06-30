<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar :active="active" @change="active = $event" />

    <main class="ml-56 flex-1 p-8">
      <div v-if="toast"
        class="fixed top-5 right-5 bg-gray-800 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg z-50">
        {{ toast }}
      </div>

      <TabDashboard v-if="active === 'Dashboard'"
        :daftarSiswa="daftarSiswa" :statCards="statCards"
        @pindah="active = $event" />

      <TabGuru v-if="active === 'Data Guru'"
        :daftarGuru="daftarGuru"
        @tambah="modalGuru = {}"
        @edit="modalGuru = $event"
        @hapus="hapusItem('guru', $event)" />

      <TabSiswa v-if="active === 'Data Siswa'"
        :daftarSiswa="daftarSiswa"
        @tambah="modalSiswa = {}"
        @edit="modalSiswa = $event"
        @hapus="hapusItem('siswa', $event)" />

      <TabMapel v-if="active === 'Mata Pelajaran'"
        :daftarMapel="daftarMapel" :guruMapelList="guruMapelList"
        @tambahMapel="modalMapel = {}"
        @editMapel="modalMapel = $event"
        @hapusMapel="hapusItem('mapel', $event)"
        @tambahPenugasan="modalPenugasan = true"
        @hapusPenugasan="hapusPenugasan($event)" />

      <TabLaporan v-if="active === 'Laporan'"
        :laporan="laporan"
        :filterKelas="filterKelas" :filterMapel="filterMapel"
        :daftarMapel="daftarMapel" :daftarKelas="daftarKelas"
        @update:filterKelas="filterKelas = $event"
        @update:filterMapel="filterMapel = $event"
        @muat="muatLaporan" />
    </main>

    <!-- modal siswa -->
    <div v-if="modalSiswa !== null"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 class="font-semibold text-gray-800">{{ modalSiswa.nis ? 'Edit Siswa' : 'Tambah Siswa' }}</h3>
          <button @click="modalSiswa = null" class="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        <div class="px-6 py-5">
          <FormSiswa :data="modalSiswa" @done="selesaiModal('siswa')" />
        </div>
      </div>
    </div>

    <!-- modal guru -->
    <div v-if="modalGuru !== null"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 class="font-semibold text-gray-800">{{ modalGuru.id_guru ? 'Edit Guru' : 'Tambah Guru' }}</h3>
          <button @click="modalGuru = null" class="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        <div class="px-6 py-5">
          <FormGuru :data="modalGuru" @done="selesaiModal('guru')" />
        </div>
      </div>
    </div>

    <!-- modal mapel -->
    <div v-if="modalMapel !== null"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 class="font-semibold text-gray-800">{{ modalMapel.id_mapel ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran' }}</h3>
          <button @click="modalMapel = null" class="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        <div class="px-6 py-5">
          <FormMapel :data="modalMapel" @done="selesaiModal('mapel')" />
        </div>
      </div>
    </div>

    <!-- modal penugasan guru -->
    <div v-if="modalPenugasan"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 class="font-semibold text-gray-800">Tambah Penugasan Guru</h3>
          <button @click="modalPenugasan = false; resetPenugasan()" class="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        <div class="px-6 py-5 space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Guru</label>
            <select v-model="formPenugasan.id_guru"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
              <option value="">-- Pilih Guru --</option>
              <option v-for="g in daftarGuru" :key="g.id_guru" :value="g.id_guru">{{ g.nama_guru }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Mata Pelajaran</label>
            <select v-model="formPenugasan.id_mapel"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
              <option value="">-- Pilih Mapel --</option>
              <option v-for="m in daftarMapel" :key="m.id_mapel" :value="m.id_mapel">{{ m.nama_mapel }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Kelas</label>
            <select v-model="formPenugasan.kelas"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
              <option value="">-- Pilih Kelas --</option>
              <option v-for="k in daftarKelas" :key="k" :value="k">{{ k }}</option>
            </select>
          </div>
          <p v-if="errPenugasan" class="text-red-500 text-xs">{{ errPenugasan }}</p>
          <div class="flex gap-2 pt-1">
            <button @click="simpanPenugasan"
              class="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 text-sm rounded-lg font-medium">
              Simpan Penugasan
            </button>
            <button @click="modalPenugasan = false; resetPenugasan()"
              class="flex-1 border border-gray-200 text-gray-600 py-2.5 text-sm rounded-lg hover:bg-gray-50">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import FormSiswa from '../components/FormSiswa.vue'
import FormGuru from '../components/FormGuru.vue'
import FormMapel from '../components/FormMapel.vue'
import TabDashboard from '../components/admin/TabDashboard.vue'
import TabGuru from '../components/admin/TabGuru.vue'
import TabSiswa from '../components/admin/TabSiswa.vue'
import TabMapel from '../components/admin/TabMapel.vue'
import TabLaporan from '../components/admin/TabLaporan.vue'
import { getDaftarSiswa, hapusSiswa, getDaftarKelas } from '../services/siswaService'
import { getDaftarGuru, hapusGuru, getGuruMapel, tambahGuruMapel, hapusGuruMapel } from '../services/guruService'
import { getLaporan } from '../services/nilaiService'
import api from '../services/authService'

const active = ref('Dashboard')
const daftarSiswa = ref([])
const daftarGuru = ref([])
const daftarMapel = ref([])
const guruMapelList = ref([])
const laporan = ref(null)
const filterKelas = ref('')
const filterMapel = ref('')
const daftarKelas = ref([])
const modalSiswa = ref(null)
const modalGuru = ref(null)
const modalMapel = ref(null)
const modalPenugasan = ref(false)
const formPenugasan = ref({ id_guru: '', id_mapel: '', kelas: '' })
const errPenugasan = ref('')
const toast = ref('')

function tampilToast(msg) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 3000)
}

async function muatData() {
  daftarSiswa.value = await getDaftarSiswa().catch(() => [])
  daftarGuru.value = await getDaftarGuru().catch(() => [])
  daftarMapel.value = await api.get('/mapel/semua').then((r) => r.data).catch(() => [])
  daftarKelas.value = await getDaftarKelas().catch(() => [])
  guruMapelList.value = await getGuruMapel().catch(() => [])
}

function resetPenugasan() {
  formPenugasan.value = { id_guru: '', id_mapel: '', kelas: '' }
  errPenugasan.value = ''
}

async function simpanPenugasan() {
  const { id_guru, id_mapel, kelas } = formPenugasan.value
  if (!id_guru || !id_mapel || !kelas) { errPenugasan.value = 'Semua field harus diisi'; return }
  try {
    await tambahGuruMapel({ id_guru, id_mapel: Number(id_mapel), kelas })
    modalPenugasan.value = false
    resetPenugasan()
    await muatData()
    tampilToast('Penugasan guru berhasil ditambahkan')
  } catch (e) {
    errPenugasan.value = e.response?.data?.pesan || 'Gagal menyimpan'
  }
}

async function hapusPenugasan(id) {
  if (!window.confirm('Hapus penugasan ini?')) return
  await hapusGuruMapel(id).catch(() => {})
  await muatData()
  tampilToast('Penugasan dihapus')
}

async function muatLaporan() {
  const params = {}
  if (filterKelas.value) params.kelas = filterKelas.value
  if (filterMapel.value) params.id_mapel = filterMapel.value
  laporan.value = await getLaporan(params).catch(() => null)
}

async function hapusItem(tipe, id) {
  if (!window.confirm(`Hapus ${tipe} ini?`)) return
  try {
    if (tipe === 'guru') await hapusGuru(id)
    if (tipe === 'siswa') await hapusSiswa(id)
    if (tipe === 'mapel') await api.delete(`/mapel/${id}`)
    muatData()
    tampilToast(`${tipe.charAt(0).toUpperCase() + tipe.slice(1)} dihapus`)
  } catch (e) {
    tampilToast(e.response?.data?.pesan || `Gagal menghapus ${tipe}`)
  }
}

function selesaiModal(tipe) {
  if (tipe === 'siswa') { tampilToast(modalSiswa.value?.nis ? 'Siswa diperbarui' : 'Siswa ditambahkan'); modalSiswa.value = null }
  if (tipe === 'guru') { tampilToast(modalGuru.value?.id_guru ? 'Guru diperbarui' : 'Guru ditambahkan'); modalGuru.value = null }
  if (tipe === 'mapel') { tampilToast(modalMapel.value?.id_mapel ? 'Mapel diperbarui' : 'Mapel ditambahkan'); modalMapel.value = null }
  muatData()
}

const statCards = computed(() => [
  { label: 'Total Siswa', value: daftarSiswa.value.length, color: 'bg-teal-50 text-teal-600' },
  { label: 'Total Guru', value: daftarGuru.value.length, color: 'bg-yellow-50 text-yellow-600' },
  { label: 'Lulus', value: laporan.value?.lulus ?? 0, color: 'bg-green-50 text-green-600' },
  { label: 'Tidak Lulus', value: laporan.value?.tidakLulus ?? 0, color: 'bg-red-50 text-red-500' },
])

onMounted(() => {
  muatData()
  getLaporan({}).then((r) => { laporan.value = r }).catch(() => {})
})
</script>
