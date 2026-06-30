const express = require('express');
const db      = require('../config/db');

const router = express.Router();

router.get('/semua', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id_mapel, nama_mapel FROM mata_pelajaran ORDER BY nama_mapel');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ pesan: 'Gagal mengambil mata pelajaran' });
  }
});

router.get('/milik', async (req, res) => {
  const { id_guru } = req.query;
  try {
    const { rows } = await db.query(
      `SELECT gm.id AS id_guru_mapel, gm.kelas, mp.id_mapel, mp.nama_mapel
       FROM guru_mapel gm
       JOIN mata_pelajaran mp ON gm.id_mapel = mp.id_mapel
       WHERE gm.id_guru = $1
       ORDER BY mp.nama_mapel, gm.kelas`,
      [id_guru]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ pesan: 'Gagal mengambil mata pelajaran' });
  }
});

router.get('/guru-mapel', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT gm.id, gm.kelas, gm.id_guru, g.nama_guru, gm.id_mapel, mp.nama_mapel
       FROM guru_mapel gm
       JOIN guru g ON gm.id_guru = g.id_guru
       JOIN mata_pelajaran mp ON gm.id_mapel = mp.id_mapel
       ORDER BY mp.nama_mapel, gm.kelas`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ pesan: 'Gagal mengambil data guru mapel' });
  }
});

router.post('/', async (req, res) => {
  const { nama_mapel } = req.body;
  try {
    const { rows: [r] } = await db.query(
      'INSERT INTO mata_pelajaran (nama_mapel) VALUES ($1) RETURNING id_mapel',
      [nama_mapel]
    );
    res.status(201).json({ pesan: 'Mata pelajaran berhasil ditambahkan', id_mapel: r.id_mapel });
  } catch (err) {
    res.status(500).json({ pesan: 'Gagal menambahkan mata pelajaran' });
  }
});

router.post('/guru-mapel', async (req, res) => {
  const { id_guru, id_mapel, kelas } = req.body;
  try {
    const { rows: cek } = await db.query(
      'SELECT id FROM guru_mapel WHERE id_guru = $1 AND id_mapel = $2 AND kelas = $3',
      [id_guru, id_mapel, kelas]
    );
    if (cek.length > 0)
      return res.status(400).json({ pesan: 'Guru sudah mengajar mapel ini di kelas tersebut' });

    await db.query(
      'INSERT INTO guru_mapel (id_guru, id_mapel, kelas) VALUES ($1, $2, $3)',
      [id_guru, id_mapel, kelas]
    );
    res.status(201).json({ pesan: 'Penugasan guru berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ pesan: 'Gagal menambahkan penugasan guru' });
  }
});

router.put('/:id', async (req, res) => {
  const { nama_mapel } = req.body;
  try {
    const { rowCount } = await db.query(
      'UPDATE mata_pelajaran SET nama_mapel = $1 WHERE id_mapel = $2',
      [nama_mapel, req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ pesan: 'Mapel tidak ditemukan' });
    res.json({ pesan: 'Mata pelajaran berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ pesan: 'Gagal memperbarui mata pelajaran' });
  }
});

router.delete('/guru-mapel/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM nilai WHERE id_guru_mapel = $1', [req.params.id]);
    const { rowCount } = await db.query('DELETE FROM guru_mapel WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ pesan: 'Data tidak ditemukan' });
    res.json({ pesan: 'Penugasan guru berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ pesan: 'Gagal menghapus penugasan guru' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rows: cek } = await db.query(
      'SELECT id FROM guru_mapel WHERE id_mapel = $1 LIMIT 1',
      [req.params.id]
    );
    if (cek.length > 0)
      return res.status(400).json({ pesan: 'Hapus semua penugasan guru untuk mapel ini terlebih dahulu.' });

    const { rowCount } = await db.query('DELETE FROM mata_pelajaran WHERE id_mapel = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ pesan: 'Mapel tidak ditemukan' });
    res.json({ pesan: 'Mata pelajaran berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ pesan: 'Gagal menghapus mata pelajaran' });
  }
});

module.exports = router;
