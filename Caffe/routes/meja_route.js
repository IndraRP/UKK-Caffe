// routes/mejaRoutes.js
const express = require('express');
const router = express.Router(); // Gunakan router
const control = require('../controllers/meja_controller');
const auth  = require('../controllers/auth');
const { checkRole } = require('../controllers/middleware'); 

router.get("/getAll", auth.authVerify, checkRole(["admin","kasir"]), control.getAllMeja);
router.post("/add", auth.authVerify, checkRole(["admin"]), control.addMeja);
router.put("/update/:id", auth.authVerify, checkRole(["admin"]), control.updateMeja);
router.delete("/delete/:id", auth.authVerify, checkRole(["admin"]), control.deleteMeja);

router.put("/meja/update-status", auth.authVerify, checkRole(["manajer,kasir"]), control.updateTableStatus);
router.get('/getOccupied', auth.authVerify, checkRole(["kasir"]), control.getOccupiedTables);
router.get("/search/:nomor_meja", auth.authVerify, checkRole(["admin"]), control.searchMeja);

module.exports = router; // Ekspor router, bukan app