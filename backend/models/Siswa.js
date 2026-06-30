// class untuk menyimpan dan memvalidasi data siswa
class Siswa {
  constructor(nis, nama, kelas, id_user) {
    this.nis     = nis;
    this.nama    = nama;
    this.kelas   = kelas;
    this.id_user = id_user;
  }

  // cek semua field wajib tidak kosong
  validasi() {
    const errors = [];
    if (!this.nis   || String(this.nis).trim()   === '') errors.push('NIS tidak boleh kosong');
    if (!this.nama  || String(this.nama).trim()  === '') errors.push('Nama tidak boleh kosong');
    if (!this.kelas || String(this.kelas).trim() === '') errors.push('Kelas tidak boleh kosong');
    return { valid: errors.length === 0, errors };
  }

  // kembalikan data tanpa id_user
  toJSON() {
    return {
      nis:   this.nis,
      nama:  this.nama,
      kelas: this.kelas,
    };
  }
}

module.exports = Siswa;
