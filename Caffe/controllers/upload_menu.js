const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
const menuModel = require('../models/index').menu;

// Konfigurasi multer untuk menyimpan gambar di folder 'images/'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../images')); // Pastikan folder 'images/' ada
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});


const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
}).single('gambar'); // 'gambar' adalah field yang mengandung file


const menuControl = {
    // CREATE Menu
    async create_menu(req, res) {
        upload(req, res, async (err) => {
            if (err) {
                console.error('Upload Error:', err.message);
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            // Membuat objek menu baru
            const newMenu = {
                nama_menu: req.body.nama_menu,
                harga: req.body.harga,
                jenis: req.body.jenis,
                deskripsi: req.body.deskripsi,
                gambar: req.file ? req.file.filename : null // Simpan nama file gambar
            };

            try {
                // Mengecek apakah menu sudah ada berdasarkan nama_menu
                const cekmenu = await menuModel.findOne({ where: { nama_menu: req.body.nama_menu } });
                if (cekmenu) {
                    // Hapus file gambar yang sudah di-upload jika menu sudah ada
                    if (req.file) {
                        const imagePath = path.join(__dirname, '../images/', req.file.filename);
                        fs.unlink(imagePath, (err) => {
                            if (err) {
                                console.error('Error deleting file: ', err);
                            }
                        });
                    }
                    return res.status(400).json({
                        success: false,
                        message: 'Menu sudah ada'
                    });
                }

                // Membuat menu baru di database
                const menu = await menuModel.create(newMenu);
                return res.status(201).json({
                    success: true,
                    message: 'Menu created successfully',
                    data: menu
                });
            } catch (error) {
                // Hapus gambar jika terjadi error dalam pembuatan menu
                if (req.file) {
                    const imagePath = path.join(__dirname, '../images/', req.file.filename);
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error('Error deleting file: ', err);
                        }
                    });
                }
                return res.status(500).json({
                    success: false,
                    message: 'Error creating menu',
                    error: error.message
                });
            }
        });
    },

    // GET ALL Menu
    async getall_menu(req, res) {
        try {
            const menus = await menuModel.findAll();
            return res.status(200).json({
                success: true,
                message: 'Menu retrieved successfully',
                data: menus
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error retrieving menu',
                error: error.message
            });
        }
    },

    // FILTER Menu
    async filter_menu(req, res) {
        try {
            const { jenis, hargaMax } = req.body;
            const where = {};

            if (jenis) {
                where.jenis = jenis;
            }

            if (hargaMax) {
                where.harga = { [Op.lte]: hargaMax }; // <=
            }

            const result = await menuModel.findAll({
                where,
            });

            return res.json({
                status: true,
                data: result,
            });
        } catch (error) {
            return res.json({
                status: false,
                message: error.message,
            });
        }
    },

    // UPDATE Menu (with optional image update)
    async update_menu(req, res) {
        const id = req.params.id_menu;

        upload(req, res, async (err) => {
            if (err) {
                console.error('Upload Error:', err.message);
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            try {
                // 1. Get existing menu from database
                const menu = await menuModel.findByPk(id);
                if (!menu) {
                    // Jika menu tidak ditemukan, hapus gambar yang di-upload jika ada
                    if (req.file) {
                        const imagePath = path.join(__dirname, '../images/', req.file.filename);
                        fs.unlink(imagePath, (err) => {
                            if (err) {
                                console.error('Error deleting file: ', err);
                            }
                        });
                    }
                    return res.status(404).json({
                        success: false,
                        message: 'Menu not found'
                    });
                }

                // 2. Prepare updated data
                const updatedMenu = {
                    nama_menu: req.body.nama_menu,
                    harga: req.body.harga,
                    jenis: req.body.jenis,
                    deskripsi: req.body.deskripsi,
                    gambar: req.file ? req.file.filename : menu.gambar // Update image only if new image is provided
                };

                // 3. Check if there is a new image, delete old one
                if (req.file && menu.gambar) {
                    const oldImagePath = path.join(__dirname, '../images/', menu.gambar);
                    // Hapus gambar lama dari folder 'images/'
                    fs.unlink(oldImagePath, (err) => {
                        if (err) {
                            console.error('Error deleting old image: ', err);
                        } else {
                            console.log('Old image deleted successfully');
                        }
                    });
                }

                // 4. Update menu in the database
                await menuModel.update(updatedMenu, { where: { id_menu: id } });

                return res.status(200).json({
                    success: true,
                    message: 'Menu updated successfully'
                });
            } catch (error) {
                // Hapus gambar baru jika terjadi error dalam pembaruan menu
                if (req.file) {
                    const imagePath = path.join(__dirname, '../images/', req.file.filename);
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error('Error deleting file: ', err);
                        }
                    });
                }
                return res.status(500).json({
                    success: false,
                    message: 'Error updating menu',
                    error: error.message
                });
            }
        });
    },

    // DELETE Menu (with image deletion)
    async delete_menu(req, res) {
        const id = req.params.id_menu;

        console.log(`Attempting to delete menu with ID: ${id}`);
        try {
            // 1. Find the menu by its ID
            const menu = await menuModel.findByPk(id);
            if (!menu) {
                return res.status(404).json({
                    success: false,
                    message: 'Menu not found'
                });
            }

            // 2. Delete the menu from the database
            await menuModel.destroy({ where: { id_menu: id } });

            // 3. Check if the menu has an associated image, and delete the image from the server
            if (menu.gambar) {
                const imagePath = path.join(__dirname, '../images/', menu.gambar);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting image: ', err);
                    } else {
                        console.log('Image deleted successfully');
                    }
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Menu deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error deleting menu',
                error: error.message
            });
        }
    }
};

module.exports = menuControl;