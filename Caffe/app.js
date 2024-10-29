const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer'); // Import multer
const path = require('path'); // Import path untuk mengelola direktori

// Terapkan konfigurasi CORS
app.use(cors({
    origin: ['http://localhost:5173'], // Pastikan ini sesuai dengan port frontend Anda
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware untuk parsing request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Menyajikan file statis dari direktori uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Konfigurasi storage menggunakan multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder tempat menyimpan gambar
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Penamaan file
    }
});

app.use('/images', express.static(path.join(__dirname, 'images')));

const upload = multer({ storage: storage }); // Inisialisasi multer dengan konfigurasi storage

// Route handling
const userRoute = require('./routes/user_route');
app.use(`/user`, userRoute);

const menuRoute = require('./routes/menu_route');
app.use(`/menu`, menuRoute);

// Route untuk menambah menu dengan gambar
app.post('/menu/add', upload.single('gambar'), (req, res) => {
    // Pastikan req.file ada
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'File tidak ditemukan' });
    }

    // Lanjutkan dengan penyimpanan data menu
    const { nama_menu, jenis, deskripsi, harga } = req.body;

    // Lakukan penyimpanan data ke database...
    // Misalnya, Anda dapat menggunakan model database Anda di sini.

    return res.status(201).json({ success: true, message: 'Menu berhasil ditambahkan', file: req.file.filename });
});

const mejaRoute = require('./routes/meja_route');
app.use(`/meja`, mejaRoute);

const transaksiRoute = require('./routes/transaksi_route');
app.use(`/transaksi`, transaksiRoute);

// Jalankan server di port 8000
app.listen(8000, () => {
    console.log("Server berjalan di http://localhost:8000");
});
