const express = require('express');
const ctrl    = require('../controllers/siswaController');

const router = express.Router();

router.get('/',             ctrl.getDaftarSiswa);
router.get('/kelas-list',   ctrl.getDaftarKelas);   // ambil semua kelas unik
router.get('/kelas/:kelas', ctrl.getSiswaByKelas);
router.post('/',            ctrl.tambahSiswa);
router.put('/:nis',         ctrl.editSiswa);
router.delete('/:nis',      ctrl.hapusSiswa);

module.exports = router;
