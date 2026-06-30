const { hitungNilaiAkhir, nentukanStatus } = require('../utils/nilaiHelper');

// class untuk menyimpan dan mengolah data nilai siswa
class Nilai {
  // nilai_akhir dan status dihitung otomatis saat objek dibuat
  constructor(nis, id_mapel, id_guru, nilai_tugas, nilai_uts, nilai_uas) {
    this.nis         = nis;
    this.id_mapel    = id_mapel;
    this.id_guru     = id_guru;
    this.nilai_tugas = Number(nilai_tugas);
    this.nilai_uts   = Number(nilai_uts);
    this.nilai_uas   = Number(nilai_uas);

    // hitung otomatis pakai fungsi dari nilaiHelper
    this.nilai_akhir = hitungNilaiAkhir(this.nilai_tugas, this.nilai_uts, this.nilai_uas);
    this.status      = nentukanStatus(this.nilai_akhir);
  }

  // cek apakah nilai dalam rentang 0-100
  validasi() {
    const errors = [];
    if (this.nilai_tugas < 0 || this.nilai_tugas > 100) errors.push('Nilai tugas harus 0-100');
    if (this.nilai_uts   < 0 || this.nilai_uts   > 100) errors.push('Nilai UTS harus 0-100');
    if (this.nilai_uas   < 0 || this.nilai_uas   > 100) errors.push('Nilai UAS harus 0-100');
    return { valid: errors.length === 0, errors };
  }

  // kembalikan data sebagai object biasa untuk disimpan ke database
  toJSON() {
    return {
      nis:         this.nis,
      id_mapel:    this.id_mapel,
      id_guru:     this.id_guru,
      nilai_tugas: this.nilai_tugas,
      nilai_uts:   this.nilai_uts,
      nilai_uas:   this.nilai_uas,
      nilai_akhir: this.nilai_akhir,
      status:      this.status,
    };
  }
}

module.exports = Nilai;
