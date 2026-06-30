const express = require('express');
const ctrl    = require('../controllers/guruController');

const router = express.Router();

router.get('/',            ctrl.getDaftarGuru);
router.post('/',           ctrl.tambahGuru);
router.put('/:id_guru',    ctrl.editGuru);
router.delete('/:id_guru', ctrl.hapusGuru);

module.exports = router;
