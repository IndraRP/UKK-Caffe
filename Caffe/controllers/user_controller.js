const user = require("../models/index").user;
const jwt = require('jsonwebtoken');
const Op = require("sequelize").Op;
const md5 = require("md5");
const jsonwebtoken = require("jsonwebtoken");
const SECRET_KEY = "indomie";
const Sequelize = require('sequelize');
const sequelize = new Sequelize("cafe_ukk", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

exports.addUser = async (request, response) => {
  let newUser = {
    nama_user: request.body.nama_user,
    username: request.body.username,
    password: md5(request.body.password),
    role: request.body.role,
  };

  // Validasi input
  if (!newUser.nama_user || !newUser.username || !newUser.password || !newUser.role) {
    return response.status(400).json({
      success: false,
      message: "Harus diisi semua",
    });
  }

  try {
    // Cek jika user sudah ada
    let existingUser = await user.findAll({
      where: {
        [Op.or]: [
          { nama_user: newUser.nama_user },
          { username: newUser.username },
        ],
      },
    });

    if (existingUser.length > 0) {
      return response.status(400).json({
        success: false,
        message: "Cari nama atau username lain",
      });
    }

    // Tambah user baru
    const result = await user.create(newUser);
    return response.json({
      success: true,
      data: result,
      message: `New User has been added`,
    });
  } catch (error) {
    return response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.Login = async (request, response) => {
  try {
    // Mencari user berdasarkan username
    const findUser = await user.findOne({ where: { username: request.body.username } });

    // Jika user tidak ditemukan berdasarkan username
    if (!findUser) {
      return response.status(400).json({
        message: "Username tidak ditemukan",
      });
    }

    // Memeriksa apakah password yang diberikan sesuai
    const hashedPassword = md5(request.body.password);
    if (findUser.password !== hashedPassword) {
      return response.status(400).json({
        message: "Password salah",
      });
    }

    // Jika username dan password sesuai, buat token JWT
    let tokenPayLoad = {
      username: findUser.username,
      role: findUser.role,
      nama_user: findUser.nama_user,
    };

    let token = await jsonwebtoken.sign(tokenPayLoad, SECRET_KEY);
    return response.status(200).json({
      success: true,
      message: "Logged in",
      logged: true,
      data: {
        token: token,
        id_user: findUser.id_user,
        nama_user: findUser.nama_user,
        username: findUser.username,
        role: findUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

exports.Logout = async (request, response) => {
  try {
    // Mendapatkan token dari header Authorization
    const token = request.headers.authorization?.split(" ")[1];

    // Jika token tidak ada
    if (!token) {
      return response.status(400).json({
        message: "Token tidak ditemukan",
      });
    }

    // Verifikasi token (gunakan Promise untuk lebih baik)
    try {
      await jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return response.status(401).json({
        message: "Token tidak valid",
      });
    }

    // Di sini Anda bisa melakukan penghapusan token dari database jika menyimpannya di server
    // Misalnya, menyimpan token di database untuk blacklist
    // await blacklistToken(token); // Implementasi fungsi ini sesuai kebutuhan

    // Menghapus token dari client-side biasanya dilakukan di frontend
    return response.status(200).json({
      success: true,
      message: "Logout berhasil",
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};


exports.updateUser = async (request, response) => {
  let id_user = request.params.id;

  try {
    // Cari pengguna berdasarkan ID
    let getUser = await user.findByPk(id_user);
    if (!getUser) {
      return response.status(400).json({
        success: false,
        message: "User dengan ID tersebut tidak ada",
      });
    }

    // Ambil data dari request body
    let { nama_user, username, role, password, oldPassword } = request.body;

    // Validasi input dasar
    if (!nama_user || !username || !role) {
      return response.status(400).json({
        success: false,
        message: "Harus diisi semua. Kalau tidak ingin merubah, isi dengan value sebelumnya",
      });
    }

    // Cek apakah ada perubahan username atau nama_user yang sudah ada
    let existingUser = await user.findAll({
      where: {
        [Op.and]: [
          { id_user: { [Op.ne]: id_user } },
          {
            [Op.or]: [
              { nama_user: nama_user },
              { username: username },
            ],
          },
        ],
      },
    });

    if (existingUser.length > 0) {
      return response.status(400).json({
        success: false,
        message: "Cari nama atau username lain",
      });
    }

    // Inisialisasi objek data yang akan diupdate
    let dataUser = {
      nama_user,
      username,
      role,
    };

    // Jika ada permintaan untuk mengubah password
    if (password) {
      // Validasi bahwa oldPassword disediakan
      if (!oldPassword) {
        return response.status(400).json({
          success: false,
          message: "Old password harus disertakan untuk mengubah password",
        });
      }

      // Verifikasi oldPassword
      const isOldPasswordCorrect = getUser.password === md5(oldPassword);
      if (!isOldPasswordCorrect) {
        return response.status(400).json({
          success: false,
          message: "Password lama tidak cocok",
        });
      }

      // Hash password baru dan tambahkan ke dataUser
      dataUser.password = md5(password);
    }

    // Lakukan update data pengguna
    await user.update(dataUser, { where: { id_user: id_user } });

    return response.json({
      success: true,
      data: dataUser,
      message: `Data user telah diperbarui`,
    });
  } catch (error) {
    return response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getAllUser = async (request, response) => {
  try {
    let users = await user.findAll({
      attributes: ['id_user', 'nama_user', 'username', 'role', 'password'] // Sertakan password
    });
    if (users.length === 0) {
      return response.status(400).json({
        success: false,
        message: "No user to show",
      });
    }
    return response.json({
      status: true,
      success: users,
      message: `All user have been loaded`,
    });
  } catch (error) {
    return response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.searchUser = async (req, res) => {
  try {
    const searchCriteria = {
      [Op.or]: [
        //like  : operator pencarian teks
        { nama_user: { [Op.like]: `%${req.body.nama_user}%` } },
        { username: { [Op.like]: `%${req.body.username}%` } },
      ],
    };

    const result = await user.findAll({ where: searchCriteria });

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "User berhasil ditemukan",
        data: result,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteUser = async (request, response) => {
  let id_user = request.params.id;
  try {
    await user.destroy({ where: { id_user: id_user } });
    return response.json({
      success: true,
      message: `Data has been deleted where id: ${id_user}`,
    });
  } catch (error) {
    return response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};