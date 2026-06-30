import api from './authService';

// ambil semua data guru
export const getDaftarGuru = () =>
  api.get('/guru').then(r => r.data);

// ambil mapel + kelas yang diajar guru tertentu (dari guru_mapel)
export const getMapelMilik = (id_guru) =>
  api.get('/mapel/milik', { params: { id_guru } }).then(r => r.data);

// ambil semua relasi guru_mapel (untuk admin)
export const getGuruMapel = () =>
  api.get('/mapel/guru-mapel').then(r => r.data);

// tambah relasi guru + mapel + kelas
export const tambahGuruMapel = (data) =>
  api.post('/mapel/guru-mapel', data).then(r => r.data);

// hapus relasi guru_mapel
export const hapusGuruMapel = (id) =>
  api.delete(`/mapel/guru-mapel/${id}`).then(r => r.data);

// tambah guru baru (data berisi id_guru, nama_guru, username, password)
export const tambahGuru = (data) =>
  api.post('/guru', data).then(r => r.data);

// edit data guru berdasarkan id_guru
export const editGuru = (id_guru, data) =>
  api.put(`/guru/${id_guru}`, data).then(r => r.data);

// hapus guru berdasarkan id_guru
export const hapusGuru = (id_guru) =>
  api.delete(`/guru/${id_guru}`).then(r => r.data);
