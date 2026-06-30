const express = require('express');
const { getLaporan } = require('../controllers/laporanController');

const router = express.Router();

router.get('/', getLaporan);

module.exports = router;
