const bcrypt = require('bcrypt');
const db     = require('../config/db');
const Siswa  = require('../models/Siswa');

async function getDaftarSiswa(req, res) {
  try {
    const { rows } = await db.query(
      'SELECT s.nis, s.nama, s.kelas, s.id_user, u.username FROM siswa s JOIN users u ON s.id_user = u.id_user ORDER BY s.kelas, s.nama'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error getDaftarSiswa:', err.message);
    res.status(500).json({ pesan: 'Gagal mengambil data siswa' });
  }
}

async function getDaftarKelas(req, res) {
  try {
    const { rows } = await db.query('SELECT DISTINCT kelas FROM siswa ORDER BY kelas');
    res.json(rows.map(r => r.kelas));
  } catch (err) {
    console.error('Error getDaftarKelas:', err.message);
    res.status(500).json({ pesan: 'Gagal mengambil daftar kelas' });
  }
}

async function getSiswaByKelas(req, res) {
  try {
    const { rows } = await db.query(
      'SELECT nis, nama, kelas FROM siswa WHERE kelas = $1 ORDER BY nama',
      [req.params.kelas]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error getSiswaByKelas:', err.message);
    res.status(500).json({ pesan: 'Gagal mengambil data siswa' });
  }
}

async function tambahSiswa(req, res) {
  const { nis, nama, kelas, username, password } = req.body;
  const objekSiswa = new Siswa(nis, nama, kelas, null);
  const { valid, errors } = objekSiswa.validasi();
  if (!valid) return res.status(400).json({ pesan: 'Data tidak valid', errors });

  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const passwordHash = await bcrypt.hash(password, 10);
    const { rows: [user] } = await client.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id_user',
      [username, passwordHash, 'siswa']
    );
    await client.query(
      'INSERT INTO siswa (nis, nama, kelas, id_user) VALUES ($1, $2, $3, $4)',
      [nis, nama, kelas, user.id_user]
    );
    await client.query('COMMIT');
    res.status(201).json({ pesan: 'Siswa berhasil ditambahkan', data: objekSiswa.toJSON() });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error tambahSiswa:', err.message);
    if (err.code === '23505')
      return res.status(400).json({ pesan: 'NIS atau username sudah terdaftar' });
    res.status(500).json({ pesan: 'Gagal menambahkan siswa' });
  } finally {
    client.release();
  }
}

async function editSiswa(req, res) {
  const { nama, kelas } = req.body;
  try {
    const { rowCount } = await db.query(
      'UPDATE siswa SET nama = $1, kelas = $2 WHERE nis = $3',
      [nama, kelas, req.params.nis]
    );
    if (rowCount === 0) return res.status(404).json({ pesan: 'Siswa tidak ditemukan' });
    res.json({ pesan: 'Data siswa berhasil diperbarui' });
  } catch (err) {
    console.error('Error editSiswa:', err.message);
    res.status(500).json({ pesan: 'Gagal memperbarui siswa' });
  }
}

async function hapusSiswa(req, res) {
  const { nis } = req.params;
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT id_user FROM siswa WHERE nis = $1', [nis]);
    if (rows.length === 0) return res.status(404).json({ pesan: 'Siswa tidak ditemukan' });
    const { id_user } = rows[0];
    await client.query('DELETE FROM nilai WHERE nis = $1', [nis]);
    await client.query('DELETE FROM siswa WHERE nis = $1', [nis]);
    await client.query('DELETE FROM users WHERE id_user = $1', [id_user]);
    await client.query('COMMIT');
    res.json({ pesan: 'Siswa berhasil dihapus' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error hapusSiswa:', err.message);
    res.status(500).json({ pesan: 'Gagal menghapus siswa' });
  } finally {
    client.release();
  }
}

module.exports = { getDaftarSiswa, getDaftarKelas, getSiswaByKelas, tambahSiswa, editSiswa, hapusSiswa };
