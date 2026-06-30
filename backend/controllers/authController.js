const bcrypt = require('bcrypt');
const db     = require('../config/db');

async function login(req, res) {
  const { username, password } = req.body;
  try {
    const { rows } = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if (rows.length === 0)
      return res.status(401).json({ pesan: 'Username atau password salah' });

    const user = rows[0];
    const passwordCocok = await bcrypt.compare(password, user.password_hash);
    if (!passwordCocok)
      return res.status(401).json({ pesan: 'Username atau password salah' });

    const data = { id_user: user.id_user, username: user.username, role: user.role };

    if (user.role === 'siswa') {
      const { rows: s } = await db.query('SELECT nis FROM siswa WHERE id_user = $1', [user.id_user]);
      if (s.length > 0) data.nis = s[0].nis;
    }
    if (user.role === 'guru') {
      const { rows: g } = await db.query('SELECT id_guru FROM guru WHERE id_user = $1', [user.id_user]);
      if (g.length > 0) data.id_guru = g[0].id_guru;
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ pesan: 'Gagal login' });
  }
}

module.exports = { login };
