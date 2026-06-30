const express = require('express');
const ctrl    = require('../controllers/nilaiController');

const router = express.Router();

router.get('/saya',        ctrl.getNilaiSaya);
router.get('/saya/status', ctrl.getStatusNilaiSaya);
router.get('/rekap',       ctrl.getRekapNilai);
router.post('/',           ctrl.inputNilai);
router.put('/:id_nilai',   ctrl.editNilai);

module.exports = router;
