const db               = require('../config/db');
const { olahLaporan }  = require('../utils/nilaiHelper');

async function getLaporan(req, res) {
  const { kelas, id_mapel } = req.query;
  const params = []
  const extras = []
  if (kelas)    { params.push(kelas);    extras.push(`gm.kelas = $${params.length}`) }
  if (id_mapel) { params.push(id_mapel); extras.push(`gm.id_mapel = $${params.length}`) }
  const whereExtra = extras.length ? 'AND ' + extras.join(' AND ') : ''

  try {
    const { rows } = await db.query(
      `SELECT n.id_nilai, s.nis, s.nama, gm.kelas, mp.nama_mapel, g.nama_guru,
              n.nilai_tugas, n.nilai_uts, n.nilai_uas, n.nilai_akhir, n.status
       FROM nilai n
       JOIN guru_mapel gm     ON n.id_guru_mapel = gm.id
       JOIN siswa s           ON n.nis            = s.nis
       JOIN mata_pelajaran mp ON gm.id_mapel      = mp.id_mapel
       JOIN guru g            ON gm.id_guru       = g.id_guru
       WHERE 1=1 ${whereExtra}
       ORDER BY gm.kelas, s.nama`,
      params
    );
    res.json(olahLaporan(rows));
  } catch (err) {
    console.error('Error getLaporan:', err.message);
    res.status(500).json({ pesan: 'Gagal mengambil laporan' });
  }
}

module.exports = { getLaporan };
