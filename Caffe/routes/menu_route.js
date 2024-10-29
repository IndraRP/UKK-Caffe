const express = require('express');
const router = express.Router(); // Tambahkan ini untuk mendefinisikan router
const auth = require('../controllers/auth');
const { checkRole } = require('../controllers/middleware');
const upload = require('../controllers/upload_menu');

// Rute
router.post('/add', auth.authVerify, checkRole(["admin"]), upload.create_menu);
router.put('/update/:id_menu', auth.authVerify, checkRole(["admin"]), upload.update_menu);
router.post('/filter', auth.authVerify, checkRole(['admin']), upload.filter_menu); // Perbaiki authVerify di sini
router.delete('/delete/:id_menu', auth.authVerify, checkRole(["admin"]), upload.delete_menu);
router.get("/getAll", auth.authVerify, checkRole(["admin", "kasir", "manajer"]), upload.getall_menu);

module.exports = router; // Pastikan Anda mengekspor router
