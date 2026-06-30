// fungsi-fungsi untuk pengolahan nilai siswa

// hitung nilai akhir: 30% tugas + 30% uts + 40% uas
function hitungNilaiAkhir(tugas, uts, uas) {
  const nilaiAkhir = (0.3 * tugas) + (0.3 * uts) + (0.4 * uas);
  return Math.round(nilaiAkhir);
}

// tentukan status lulus atau tidak berdasarkan nilai akhir
function nentukanStatus(nilaiAkhir) {
  if (nilaiAkhir >= 70) {
    return 'Lulus';
  } else {
    return 'Tidak Lulus';
  }
}

// buat laporan ringkas dari array data nilai
function olahLaporan(dataNilai) {
  const total      = dataNilai.length;
  const lulus      = dataNilai.filter(n => n.status === 'Lulus').length;
  const tidakLulus = total - lulus;
  const rataRata   = total > 0
    ? Math.round(dataNilai.reduce((jumlah, n) => jumlah + n.nilai_akhir, 0) / total)
    : 0;

  return { total, lulus, tidakLulus, rataRata, detail: dataNilai };
}

module.exports = { hitungNilaiAkhir, nentukanStatus, olahLaporan };
