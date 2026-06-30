import api from './authService';

// ambil semua data siswa
export const getDaftarSiswa = () =>
  api.get('/siswa').then(r => r.data);

// ambil daftar kelas yang unik (untuk dropdown)
export const getDaftarKelas = () =>
  api.get('/siswa/kelas-list').then(r => r.data);

// ambil siswa berdasarkan kelas tertentu
export const getSiswaByKelas = (kelas) =>
  api.get(`/siswa/kelas/${kelas}`).then(r => r.data);

// tambah siswa baru (data berisi nis, nama, kelas, username, password)
export const tambahSiswa = (data) =>
  api.post('/siswa', data).then(r => r.data);

// edit data siswa berdasarkan NIS
export const editSiswa = (nis, data) =>
  api.put(`/siswa/${nis}`, data).then(r => r.data);

// hapus siswa berdasarkan NIS
export const hapusSiswa = (nis) =>
  api.delete(`/siswa/${nis}`).then(r => r.data);
