const express = require('express');
const router = express.Router(); // Buat instance router
const control = require('../controllers/transaksi_controller');
const auth = require('../controllers/auth');
const { checkRole } = require('../controllers/middleware');
const path = require('path'); // Impor path
const fs = require('fs'); // Impor fs

router.get("/filtertanggal/:startDate/:endDate", auth.authVerify, checkRole(["manajer"]), control.filtertanggal);
router.get("/getID/:id", auth.authVerify, checkRole(["manajer", "kasir"]), control.getID);
router.get("/getAll", auth.authVerify, checkRole(["manajer", "kasir"]), control.getAll);
router.post("/add", auth.authVerify, checkRole(["manajer", "kasir"]), control.addTransaksi);
router.put("/update/:id", auth.authVerify, checkRole(["manajer", "kasir"]), control.editTransaksi);
router.delete("/delete/:id", auth.authVerify, checkRole(["manajer", "kasir"]), control.deleteTransaksi);

router.get("/struk/:id_transaksi", auth.authVerify, checkRole(["kasir"]), control.receipt);

// Rute untuk mengunduh file PDF
router.get('/receipt/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../receipt', req.params.filename);
  console.log("Requested file:", filePath); // Pastikan log ini ada di sini
  
  // Cek apakah file ada
  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    return res.status(404).send("File not found");
  }

  // Kirim file PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename}"`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      return res.status(500).send("Error sending file");
    }
    console.log("File sent successfully:", filePath);
  });
});

// Ekspor router
module.exports = router;
