const db              = require('../config/db');
const Nilai           = require('../models/Nilai');
const { olahLaporan } = require('../utils/nilaiHelper');

async function inputNilai(req, res) {
  const { nis, id_guru_mapel, nilai_tugas, nilai_uts, nilai_uas } = req.body;
  const objekNilai = new Nilai(nis, id_guru_mapel, null, nilai_tugas, nilai_uts, nilai_uas);
  const { valid, errors } = objekNilai.validasi();
  if (!valid) return res.status(400).json({ pesan: 'Nilai tidak valid', errors });

  const data = objekNilai.toJSON();
  try {
    const { rows: cek } = await db.query(
      'SELECT id_nilai FROM nilai WHERE nis = $1 AND id_guru_mapel = $2',
      [nis, id_guru_mapel]
    );
    if (cek.length > 0)
      return res.status(400).json({ pesan: 'Siswa ini sudah memiliki nilai untuk mata pelajaran tersebut. Gunakan fitur Edit untuk mengubah nilai.' });

    await db.query(
      'INSERT INTO nilai (nis, id_guru_mapel, nilai_tugas, nilai_uts, nilai_uas, nilai_akhir, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [nis, id_guru_mapel, data.nilai_tugas, data.nilai_uts, data.nilai_uas, data.nilai_akhir, data.status]
    );
    res.status(201).json({ pesan: 'Nilai berhasil diinput', nilaiAkhir: data.nilai_akhir, status: data.status });
  } catch (err) {
    console.error('Error inputNilai:', err.message);
    res.status(500).json({ pesan: 'Gagal menyimpan nilai' });
  }
}

async function editNilai(req, res) {
  const { nilai_tugas, nilai_uts, nilai_uas } = req.body;
  const objekNilai = new Nilai(null, null, null, nilai_tugas, nilai_uts, nilai_uas);
  const { valid, errors } = objekNilai.validasi();
  if (!valid) return res.status(400).json({ pesan: 'Nilai tidak valid', errors });

  try {
    const { rowCount } = await db.query(
      'UPDATE nilai SET nilai_tugas = $1, nilai_uts = $2, nilai_uas = $3, nilai_akhir = $4, status = $5 WHERE id_nilai = $6',
      [objekNilai.nilai_tugas, objekNilai.nilai_uts, objekNilai.nilai_uas,
       objekNilai.nilai_akhir, objekNilai.status, req.params.id_nilai]
    );
    if (rowCount === 0) return res.status(404).json({ pesan: 'Nilai tidak ditemukan' });
    res.json({ pesan: 'Nilai berhasil diperbarui', nilaiAkhir: objekNilai.nilai_akhir, status: objekNilai.status });
  } catch (err) {
    console.error('Error editNilai:', err.message);
    res.status(500).json({ pesan: 'Gagal memperbarui nilai' });
  }
}

async function getRekapNilai(req, res) {
  const { id_guru, id_mapel, kelas } = req.query;
  const params = []
  const extras = []
  if (id_guru)  { params.push(id_guru);  extras.push(`gm.id_guru = $${params.length}`) }
  if (id_mapel) { params.push(id_mapel); extras.push(`gm.id_mapel = $${params.length}`) }
  if (kelas)    { params.push(kelas);    extras.push(`gm.kelas = $${params.length}`) }
  const whereExtra = extras.length ? 'AND ' + extras.join(' AND ') : ''

  try {
    const { rows } = await db.query(
      `SELECT n.id_nilai, s.nis, s.nama, gm.kelas, mp.nama_mapel, gm.id AS id_guru_mapel,
              n.nilai_tugas, n.nilai_uts, n.nilai_uas, n.nilai_akhir, n.status
       FROM nilai n
       JOIN guru_mapel gm     ON n.id_guru_mapel = gm.id
       JOIN siswa s           ON n.nis           = s.nis
       JOIN mata_pelajaran mp ON gm.id_mapel     = mp.id_mapel
       WHERE 1=1 ${whereExtra}
       ORDER BY gm.kelas, s.nama`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error('Error getRekapNilai:', err.message);
    res.status(500).json({ pesan: 'Gagal mengambil rekap nilai' });
  }
}

async function getNilaiSaya(req, res) {
  const { nis } = req.query;
  try {
    const { rows } = await db.query(
      `SELECT n.id_nilai, mp.nama_mapel, g.nama_guru, gm.kelas,
              n.nilai_tugas, n.nilai_uts, n.nilai_uas, n.nilai_akhir, n.status
       FROM nilai n
       JOIN guru_mapel gm     ON n.id_guru_mapel = gm.id
       JOIN mata_pelajaran mp ON gm.id_mapel     = mp.id_mapel
       JOIN guru g            ON gm.id_guru      = g.id_guru
       WHERE n.nis = $1
       ORDER BY mp.nama_mapel`,
      [nis]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error getNilaiSaya:', err.message);
    res.status(500).json({ pesan: 'Gagal mengambil nilai' });
  }
}

async function getStatusNilaiSaya(req, res) {
  const { nis } = req.query;
  try {
    const { rows } = await db.query(
      `SELECT mp.nama_mapel, n.nilai_akhir, n.status
       FROM nilai n
       JOIN guru_mapel gm     ON n.id_guru_mapel = gm.id
       JOIN mata_pelajaran mp ON gm.id_mapel     = mp.id_mapel
       WHERE n.nis = $1
       ORDER BY mp.nama_mapel`,
      [nis]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error getStatusNilaiSaya:', err.message);
    res.status(500).json({ pesan: 'Gagal mengambil status nilai' });
  }
}

module.exports = { inputNilai, editNilai, getRekapNilai, getNilaiSaya, getStatusNilaiSaya };
