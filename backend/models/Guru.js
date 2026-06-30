// class untuk menyimpan dan memvalidasi data guru
class Guru {
  constructor(id_guru, nama_guru, id_user) {
    this.id_guru   = id_guru;
    this.nama_guru = nama_guru;
    this.id_user   = id_user;
  }

  // cek semua field wajib tidak kosong
  validasi() {
    const errors = [];
    if (!this.id_guru   || String(this.id_guru).trim()   === '') errors.push('ID Guru tidak boleh kosong');
    if (!this.nama_guru || String(this.nama_guru).trim() === '') errors.push('Nama Guru tidak boleh kosong');
    return { valid: errors.length === 0, errors };
  }

  // kembalikan data tanpa id_user
  toJSON() {
    return {
      id_guru:   this.id_guru,
      nama_guru: this.nama_guru,
    };
  }
}

module.exports = Guru;
