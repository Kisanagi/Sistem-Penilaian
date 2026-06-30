import api from './authService';

// === Untuk Guru ===

// input nilai baru (id_guru dikirim di body)
export const inputNilai = (data) =>
  api.post('/nilai', data).then(r => r.data);

// edit nilai yang sudah ada
export const editNilai = (id, data) =>
  api.put(`/nilai/${id}`, data).then(r => r.data);

// ambil rekap nilai (bisa difilter by id_guru, id_mapel, kelas)
export const getRekapNilai = (params) =>
  api.get('/nilai/rekap', { params }).then(r => r.data);


// === Untuk Siswa ===

// ambil semua nilai milik siswa (nis dikirim sebagai query param)
export const getNilaiSaya = (nis) =>
  api.get('/nilai/saya', { params: { nis } }).then(r => r.data);

// ambil status kelulusan per mapel
export const getStatusNilaiSaya = (nis) =>
  api.get('/nilai/saya/status', { params: { nis } }).then(r => r.data);


// === Untuk Admin ===

// ambil laporan nilai lengkap (bisa difilter by kelas dan id_mapel)
export const getLaporan = (params) =>
  api.get('/laporan', { params }).then(r => r.data);
