const bcrypt = require('bcrypt');
const db     = require('../config/db');
const Guru   = require('../models/Guru');

async function getDaftarGuru(req, res) {
  try {
    const { rows } = await db.query(
      'SELECT g.id_guru, g.nama_guru, g.id_user, u.username FROM guru g JOIN users u ON g.id_user = u.id_user ORDER BY g.nama_guru'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error getDaftarGuru:', err.message);
    res.status(500).json({ pesan: 'Gagal mengambil data guru' });
  }
}

async function tambahGuru(req, res) {
  const { id_guru, nama_guru, username, password } = req.body;
  const guru = new Guru(id_guru, nama_guru, null);
  const { valid, errors } = guru.validasi();
  if (!valid) return res.status(400).json({ pesan: errors.join(', ') });

  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const passwordHash = await bcrypt.hash(password, 10);
    const { rows: [user] } = await client.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id_user',
      [username, passwordHash, 'guru']
    );
    await client.query(
      'INSERT INTO guru (id_guru, nama_guru, id_user) VALUES ($1, $2, $3)',
      [id_guru, nama_guru, user.id_user]
    );
    await client.query('COMMIT');
    res.status(201).json({ pesan: 'Guru berhasil ditambahkan' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error tambahGuru:', err.message);
    if (err.code === '23505')
      return res.status(400).json({ pesan: 'ID Guru atau username sudah terdaftar' });
    res.status(500).json({ pesan: 'Gagal menambahkan guru' });
  } finally {
    client.release();
  }
}

async function editGuru(req, res) {
  const { nama_guru } = req.body;
  try {
    const { rowCount } = await db.query(
      'UPDATE guru SET nama_guru = $1 WHERE id_guru = $2',
      [nama_guru, req.params.id_guru]
    );
    if (rowCount === 0) return res.status(404).json({ pesan: 'Guru tidak ditemukan' });
    res.json({ pesan: 'Data guru berhasil diperbarui' });
  } catch (err) {
    console.error('Error editGuru:', err.message);
    res.status(500).json({ pesan: 'Gagal memperbarui guru' });
  }
}

async function hapusGuru(req, res) {
  const id = req.params.id_guru;
  try {
    const { rows } = await db.query('SELECT id_user FROM guru WHERE id_guru = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ pesan: 'Guru tidak ditemukan' });
    const { id_user } = rows[0];

    // hapus nilai lewat subquery karena PostgreSQL tidak support JOIN DELETE
    await db.query(
      'DELETE FROM nilai WHERE id_guru_mapel IN (SELECT id FROM guru_mapel WHERE id_guru = $1)',
      [id]
    );
    await db.query('DELETE FROM guru_mapel WHERE id_guru = $1', [id]);
    await db.query('DELETE FROM guru WHERE id_guru = $1', [id]);
    await db.query('DELETE FROM users WHERE id_user = $1', [id_user]);

    res.json({ pesan: 'Guru berhasil dihapus' });
  } catch (err) {
    console.error('Error hapusGuru:', err.message);
    res.status(500).json({ pesan: 'Gagal menghapus guru' });
  }
}

module.exports = { getDaftarGuru, tambahGuru, editGuru, hapusGuru };
