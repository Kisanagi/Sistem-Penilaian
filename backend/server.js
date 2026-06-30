const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth',    require('./routes/auth'));
app.use('/api/siswa',   require('./routes/siswa'));
app.use('/api/guru',    require('./routes/guru'));
app.use('/api/nilai',   require('./routes/nilai'));
app.use('/api/laporan', require('./routes/laporan'));
app.use('/api/mapel',   require('./routes/mapel'));

app.get('/', (req, res) => res.json({ pesan: 'Server Nilai SMA 99 berjalan' }));

app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
