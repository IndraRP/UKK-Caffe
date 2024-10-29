const transaksi = require("../models/index").transaksi;
const Op = require("sequelize").Op;
const model = require("../models/index");
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const user = model.user;
const meja = model.meja;
const detail = model.detail_transaksi;
const menu = model.menu;
// const easyinvoice = require('easyinvoice')

exports.getAll = async (request, response) => {
  try {
    const result = await transaksi.findAll({
      include: [
        {
          model: user,
          as: "user",
        },
        {
          model: meja,
          as: "meja",
        },
        {
          model: detail, // jika ada relasi dengan detail transaksi
          as: "detail",
          include: [
            {
              model: menu, // pastikan ini adalah model yang benar
              as: "menu",
            },
          ],
        },
      ],
    });
    response.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getID = async (request, response) => {
  transaksi
    .findByPk(request.params.id, {
      include: [
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    })
    .then((result) => {
      if (result) {
        response.status(200).json({
          success: true,
          data: result,
        });
      } else {
        response.status(404).json({
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

exports.addTransaksi = async (request, response) => {
  try {
    const { id_user, id_meja, nama_pelanggan, status, detail_transaksi } = request.body;

    // Validasi dasar
    if (!id_user || !id_meja || !nama_pelanggan || !status || !Array.isArray(detail_transaksi) || detail_transaksi.length === 0) {
      return response.status(400).json({
        success: false,
        message: "Data transaksi tidak lengkap atau format detail_transaksi tidak valid",
      });
    }

    // Membuat objek data transaksi
    const dataTransaksi = {
      id_user,
      id_meja,
      nama_pelanggan,
      tgl_transaksi: new Date(),
      status,
    };

    // Membuat transaksi
    const transaksiResult = await transaksi.create(dataTransaksi);
    const id_transaksi = transaksiResult.id_transaksi; // Ambil ID transaksi yang baru dibuat

    // Memproses setiap item detail_transaksi
    const processedDetail = detail_transaksi.map(item => {
      if (!item.id_menu || !item.jumlah || item.jumlah < 1) {
        throw new Error("Detail transaksi tidak valid");
      }
      return {
        ...item,
        id_transaksi, // Sertakan ID transaksi di sini
        harga_total: item.jumlah * item.harga, // Menyimpan total harga per item
      };
    });

    // Menyimpan detail transaksi secara paralel
    const detailResult = await detail.bulkCreate(processedDetail);

    // Mengembalikan respons sukses dengan data transaksi dan detailnya
    return response.status(201).json({
      success: true,
      data: {
        transaksi: transaksiResult,
        detail: detailResult,
      },
      message: "Order list telah dibuat",
    });

  } catch (error) {
    // Mengembalikan respons error jika terjadi masalah
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.deleteTransaksi = async (request, response) => {
  try {
    const param = { id_transaksi: request.params.id };

    // Mengambil id_meja dari transaksi yang akan dihapus
    const transaksiRecord = await transaksi.findOne({ where: param });

    // Jika transaksi tidak ditemukan
    if (!transaksiRecord) {
      return response.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan",
      });
    }

    // Menghapus data detail transaksi terlebih dahulu
    await detail.destroy({ where: param });

    // Menghapus data transaksi setelah detail dihapus
    await transaksi.destroy({ where: param });

    // Mengupdate status meja menjadi 'kosong'
    const mejaUpdateResult = await meja.update(
      { status: 'kosong' }, // Status baru
      { where: { id_meja: transaksiRecord.id_meja } } // ID meja dari transaksi
    );

    // Cek jika update status meja berhasil
    if (mejaUpdateResult[0] === 0) {
      console.warn("Tidak ada meja yang diperbarui, mungkin ID meja tidak valid.");
    }

    // Jika berhasil menghapus detail dan transaksi
    return response.status(200).json({
      success: true,
      message: "Transaksi dan detail transaksi berhasil dihapus, serta status meja diperbarui.",
    });
  } catch (error) {
    // Menangani error lain
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};



exports.editTransaksi = async (request, response) => {
  const param = { id_transaksi: request.params.id };
  const dataTransaksi = {
    id_user: request.body.id_user,
    id_meja: request.body.id_meja,
    nama_pelanggan: request.body.nama_pelanggan,
    status: request.body.status,
  };

  try {
    const transaksiExist = await transaksi.findOne({ where: param });

    if (!transaksiExist) {
      return response.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan",
      });
    }

    // Update transaksi
    await transaksi.update(dataTransaksi, { where: param });

    // Update detail transaksi
    const detailPromises = request.body.detail.map(async (item) => {
      // Periksa apakah detail menu sudah ada, jika ada update, jika tidak bisa ditambahkan
      const existingDetail = await detail.findOne({
        where: { id_transaksi: param.id_transaksi, id_menu: item.id_menu },
      });

      if (existingDetail) {
        // Update detail yang sudah ada
        return detail.update(
          { jumlah: item.jumlah, harga: item.harga },
          { where: { id_transaksi: param.id_transaksi, id_menu: item.id_menu } }
        );
      } else {
        // Jika detail tidak ada, tambahkan detail baru
        return detail.create({
          id_transaksi: param.id_transaksi,
          id_menu: item.id_menu,
          jumlah: item.jumlah,
          harga: item.harga,
        });
      }
    });

    await Promise.all(detailPromises);

    // Jika status transaksi adalah lunas, update status meja
    if (request.body.status === "lunas") {
      await meja.update(
        { status: "kosong" },
        { where: { id_meja: request.body.id_meja } }
      );
    }

    response.status(200).json({
      success: true,
      message: "Transaksi berhasil diperbarui",
      data: {
        id_transaksi: param.id_transaksi,
        ...dataTransaksi,
      },
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


exports.filtertanggal = async (request, response) => {
  const { startDate, endDate } = request.params;

  try {
    const transactions = await transaksi.findAll({
      where: {
        tgl_transaksi: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
        {
          model: model.detail_transaksi,
          as: "detail",
          include: [
            {
              model: model.menu,
              as: "menu",
            },
          ],
        },
      ],
    });

    if (transactions.length === 0) {
      return response.status(404).json({
        success: false,
        message: "No transactions found in the given date range.",
      });
    }

    return response.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    return response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



exports.receipt = async (request, response) => {
  const param = request.params.id_transaksi;
  try {
    const dataTransaksi = await transaksi.findOne({
      where: { id_transaksi: param },
      include: [
        {
          model: user,
          attributes: ["nama_user"],
          as: "user",
        },
        {
          model: detail,
          as: "detail",
          include: {
            model: menu,
            attributes: ["nama_menu", "harga"],
            as: "menu",
          },
        },
      ],
    });

    if (!dataTransaksi) {
      return response.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan",
      });
    }

    const transactionDetails = dataTransaksi.detail || [];
    const receiptItems = transactionDetails.map((detail) => {
      return {
        menuName: detail.menu ? detail.menu.nama_menu : "Unknown",
        quantity: detail.jumlah,
        pricePerMenu: detail.harga,
        totalPerMenu: detail.jumlah * detail.harga,
      };
    });

    const total = receiptItems.reduce((sum, item) => sum + item.totalPerMenu, 0);

    const struk = {
      kasir: dataTransaksi.user.nama_user,
      pelanggan: dataTransaksi.nama_pelanggan,
      tanggal: dataTransaksi.tgl_transaksi,
      pembelian: receiptItems,
      total,
    };

    const printstruk = (struk) => `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px 12px; border-bottom: 1px solid #ddd; }
          th { background-color: #f4f4f4; }
          h2 { text-align: center; }
          .store-info { text-align: center; margin-bottom: 20px; }
          .store-info p { margin: 4px 0; }
        </style>
      </head>
      <body>
        <div class="store-info">
          <h2>WiCaffe</h2>
          <p>Malang, Indonesia</p>
          <p><strong>Date:</strong> ${struk.tanggal}</p>
        </div>
        <p><strong>Cashier:</strong> Kasir </p>
        <p><strong>Customer:</strong> ${struk.pelanggan}</p>
        <table>
          <thead>
            <tr>
              <th>Menu</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
          ${
            struk.pembelian && struk.pembelian.length > 0 
            ? struk.pembelian.map(item => `
              <tr>
                <td>${item.menuName || 'Unknown'}</td>
                <td>${item.quantity}</td>
                <td>${item.pricePerMenu}</td>
                <td>${item.totalPerMenu}</td>
              </tr>
            `).join('') 
            : `<tr><td colspan="4">No items found</td></tr>`
          }
          </tbody>
        </table>
        <h3>Grand Total: ${struk.total}</h3>
      </body>
      </html>
    `;

    const strukHTML = printstruk(struk);
    const directory = path.join(__dirname, '../receipt');

    // Cek dan buat direktori jika tidak ada
    if (!fs.existsSync(directory)) {
      console.log("Directory does not exist. Creating...");
      fs.mkdirSync(directory);
    }

    const file = path.join(directory, `receipt_${param}.pdf`);

    // Inisialisasi puppeteer untuk membuat PDF
    const browser = await puppeteer.launch({ headless: true }); // Opsi headless ditambahkan
    const page = await browser.newPage();
    await page.setContent(strukHTML);

    // Generate PDF
    try {
      // Setelah menciptakan PDF
      await page.pdf({
        path: file,
        format: 'A4',
        printBackground: true
      });
      console.log(`PDF created successfully at: ${file}`); // Tambahkan log untuk memastikan PDF berhasil dibuat

    } catch (pdfError) {
      console.error("Error saat membuat PDF:", pdfError.message);
      return response.status(500).json({
        success: false,
        message: 'Gagal membuat PDF: ' + pdfError.message,
      });
    }

    await browser.close();

    // Pastikan file benar-benar ada setelah dibuat
    if (!fs.existsSync(file)) {
      console.error('PDF file not found after creation:', file);
      return response.status(500).json({
        success: false,
        message: 'File PDF tidak ditemukan setelah pembuatan.',
      });
    }

    // Mengembalikan respons dengan URL file
    const urlFile = `http://localhost:8000/receipt/receipt_${param}.pdf`; // Sesuaikan URL sesuai kebutuhan
    response.json({
      success: true,
      message: 'Struk berhasil dibuat',
      file: urlFile, // Kembalikan URL file yang sudah dibuat
    });

  } catch (error) {
    console.error("Error saat membuat struk:", error.message);
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
