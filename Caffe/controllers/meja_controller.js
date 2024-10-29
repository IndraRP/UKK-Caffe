const { meja, transaksi } = require("../models/index");

exports.getAllMeja = async (request, response) => {
  meja
    .findAll()
    .then((result) => {
      response.status(200).json({
        success: true,
        data: result,
        message: "yeay",
      });
    })
    .catch((error) => {
      response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.addMeja = async (request, response) => {
  try {
    // Mengambil nomor meja dari body request
    const nomorMeja = request.body.nomor_meja;

    // Validasi untuk memastikan nomor_meja tidak undefined atau null
    if (!nomorMeja) {
      return response.status(400).json({
        success: false,
        message: "nomor_meja tidak boleh kosong",
      });
    }

    const dataMeja = {
      nomor_meja: nomorMeja,
      status: "kosong",
    };

    // Mencari meja dengan nomor_meja yang sama
    const result = await meja.findOne({ where: { nomor_meja: dataMeja.nomor_meja } });

    if (result) {
      return response.status(400).json({
        success: false,
        message: "nomor meja sudah ada",
      });
    } 

    // Membuat meja baru
    const newMeja = await meja.create(dataMeja);

    return response.status(200).json({
      success: true,
      data: newMeja,
      message: "Meja berhasil ditambahkan",
    });
    
  } catch (error) {
    // Menangani kesalahan
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteMeja = async (request, response) => {
  const param = { id_meja: request.params.id };
  meja
    .destroy({ where: param })
    .then((result) => {
      if (result) {
        response.status(200).json({
          success: true,
          message: "table has been deleted",
        });
      } else {
        response.status(400).json({
          success: false,
          message: "not found",
        });
      }
    })
    .catch((error) => {
      response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};


exports.updateMeja = async (request, response) => {
  const param = { id_meja: request.params.id };
  const dataMeja = {
    nomor_meja: request.body.nomor_meja,
    status: request.body.status, // Menambahkan status untuk diupdate
  };

  try {
    // Mencari meja berdasarkan ID
    const existingMeja = await meja.findOne({ where: param });
    if (!existingMeja) {
      return response.status(404).json({
        success: false,
        message: "Meja tidak ditemukan",
      });
    }

    // Jika nomor_meja tidak ada
    if (!dataMeja.nomor_meja) {
      return response.status(400).json({
        success: false,
        message: "Nomor meja harus diisi",
      });
    }

    // Memeriksa apakah nomor meja sudah ada
    const nomorMejaExist = await meja.findOne({ where: { nomor_meja: dataMeja.nomor_meja } });
    if (nomorMejaExist && nomorMejaExist.id_meja !== existingMeja.id_meja) {
      return response.status(400).json({
        success: false,
        message: "Nomor meja sudah ada",
      });
    }

    // Mengupdate meja
    await meja.update(dataMeja, { where: param });
    return response.status(200).json({
      success: true,
      data: {
        id_meja: existingMeja.id_meja,
        nomor_meja: dataMeja.nomor_meja,
        status: dataMeja.status,
      },
    });

  } catch (error) {
    return response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



exports.searchMeja = async (request, response) => {
  try {
    const { nomor_meja } = request.params;
    const result = await meja.findOne({ where: { nomor_meja } });

    if (!result) {
      return response.status(404).json({
        success: false,
        message: "Meja tidak ditemukan",
      });
    }

    return response.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getOccupiedTables = async (req, res) => {
  try {
    console.log("Mengambil data meja terisi...");
    
    const occupiedTables = await transaksi.findAll({
      attributes: ['id_meja'],
      where: { status: 'lunas' },
      distinct: true,
    });

    console.log("Data meja terisi:", occupiedTables);

    const mejaTerisi = occupiedTables.map(item => item.id_meja);
    console.log("Daftar meja yang terisi:", mejaTerisi);

    // Memperbarui status meja menjadi 'terisi'
    const [updateCount] = await meja.update(
      { status: 'terisi' },
      { where: { id_meja: mejaTerisi } }
    );

    console.log(`Jumlah meja yang diperbarui: ${updateCount}`);

    res.json({
      success: true,
      data: mejaTerisi,
      message: "Daftar meja yang terisi berhasil diambil dan status meja diperbarui.",
    });
  } catch (error) {
    console.error("Error in getOccupiedTables:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateTableStatus = async (req, res) => {
  const { mejaId, status } = req.body; // Ambil mejaId dan status dari request body
  try {
    console.log("Mengubah status meja...");

    // Cek apakah status valid
    if (status !== 'kosong' && status !== 'terisi') {
      return res.status(400).json({
        success: false,
        message: "Status harus 'kosong' atau 'terisi'.",
      });
    }

    const [updateCount] = await meja.update(
      { status: status },
      { where: { id_meja: mejaId } }
    );

    if (updateCount > 0) {
      res.json({
        success: true,
        message: `Status meja dengan ID ${mejaId} berhasil diperbarui menjadi ${status}.`,
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Meja dengan ID ${mejaId} tidak ditemukan.`,
      });
    }
  } catch (error) {
    console.error("Error in updateTableStatus:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
