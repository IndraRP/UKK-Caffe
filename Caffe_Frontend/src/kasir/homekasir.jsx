import React, { useEffect, useState } from "react";
import Navbar from "../component/navbar_kasir";
import axios from "axios";

const HomeKasir = () => {
  const [menus, setMenus] = useState([]);
  const [idMeja, setIdMeja] = useState("");
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [status, setStatus] = useState("");
  const [jumlahItems, setJumlahItems] = useState({});
  const [occupiedTables, setOccupiedTables] = useState([]);
  const [totalHarga, setTotalHarga] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [newTransactionId, setNewTransactionId] = useState(null);

  // Mendapatkan menu dan meja terisi dari API
  useEffect(() => {
    const getMenus = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token tidak ditemukan. Pastikan user sudah login.");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          "http://localhost:8000/menu/getAll",
          config
        );
        if (response.data.data && Array.isArray(response.data.data)) {
          setMenus(response.data.data);
        } else if (Array.isArray(response.data)) {
          setMenus(response.data);
        } else {
          throw new Error("Format data tidak sesuai.");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    const getOccupiedTables = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token tidak ditemukan. Pastikan user sudah login.");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          "http://localhost:8000/meja/getOccupied",
          config
        );
        if (response.data.success) {
          setOccupiedTables(response.data.data);
        } else {
          throw new Error(
            response.data.message || "Gagal mengambil data meja terisi."
          );
        }
      } catch (error) {
        console.error("Error fetching occupied tables:", error.message);
      }
    };

    getMenus();
    getOccupiedTables();
  }, []);


  // Fungsi untuk mengubah jumlah item yang dipilih
  const handleJumlahChange = (menuId, jumlah) => {
    const parsedJumlah = parseInt(jumlah, 10);
    if (isNaN(parsedJumlah) || parsedJumlah < 0) return; // Menghindari nilai negatif atau NaN
    setJumlahItems((prevState) => ({ ...prevState, [menuId]: parsedJumlah }));
  };


  // Menghitung total harga setiap kali jumlahItems berubah
  useEffect(() => {
    const total = menus.reduce((acc, menu) => {
      const jumlah = jumlahItems[menu.id_menu] || 0;
      return acc + menu.harga * jumlah;
    }, 0);
    setTotalHarga(total);
  }, [jumlahItems, menus]);





  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Token tidak ditemukan. Pastikan user sudah login.");
      return;
    }
  
    if (!idMeja || !namaPelanggan || !status) {
      setErrorMessage("Semua data harus diisi!");
      return;
    }
  
    if (occupiedTables.includes(parseInt(idMeja, 10))) {
      setErrorMessage("Meja yang dipilih sudah terisi.");
      return;
    }
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const dataTransaksi = {
      id_user: 1, // Contoh id_user dari kasir, sesuaikan dengan login user
      id_meja: parseInt(idMeja, 10),
      nama_pelanggan: namaPelanggan,
      status: status,
      total_harga: totalHarga, // Anda bisa mempertimbangkan untuk menghapus ini jika tidak digunakan di backend
      detail_transaksi: menus
        .filter((menu) => jumlahItems[menu.id_menu] > 0)
        .map((menu) => ({
          id_menu: menu.id_menu,
          jumlah: jumlahItems[menu.id_menu],
          harga: menu.harga,
        })),
    };
  
    try {
      const response = await axios.post(
        "http://localhost:8000/transaksi/add",
        dataTransaksi,
        config
      );
  
      console.log("Response dari backend:", response.data);
  
      if (response.data.success) {
        const { id_transaksi } = response.data.data.transaksi; // Ambil ID transaksi dari response
        setNewTransactionId(id_transaksi); // Simpan ID transaksi
        setShowPopup(true); // Tampilkan popup setelah transaksi berhasil
  
        // Reset form setelah sukses
        setIdMeja("");
        setNamaPelanggan("");
        setStatus("");
        setJumlahItems({});
        setTotalHarga(0);
        setErrorMessage("");
  
        // Refresh daftar meja terisi
        const refreshOccupiedTables = async () => {
          try {
            const response = await axios.get(
              "http://localhost:8000/meja/getOccupied",
              config
            );
            if (response.data.success) {
              setOccupiedTables(response.data.data);
            }
          } catch (error) {
            console.error("Error refreshing occupied tables:", error.message);
          }
        };
        refreshOccupiedTables();
      } else {
        alert("Gagal menambahkan transaksi: " + response.data.message);
      }
    } catch (error) {
      console.error(
        "Error menambahkan transaksi:",
        error.response ? error.response.data.message : error.message
      );
      alert(
        "Error menambahkan transaksi: " +
        (error.response ? error.response.data.message : error.message)
      );
    }
  };
  
  const handleDownloadStruk = async () => {
    console.log("ID Transaksi untuk download:", newTransactionId);
    
    if (newTransactionId) {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json', // Minta response dalam JSON untuk API struk
                },
            };

            // 1. Buat struk menggunakan API
            const createReceiptUrl = `http://localhost:8000/transaksi/struk/${newTransactionId}`;
            const createResponse = await axios.get(createReceiptUrl, config);

            console.log("Create receipt response status:", createResponse.status);
            if (createResponse.status === 200) {
                // 2. Jika berhasil, lanjutkan untuk mengunduh struk
                const downloadConfig = {
                    ...config,
                    responseType: 'blob', // Atur untuk menangani file binary saat mengunduh
                };

                const downloadUrl = `http://localhost:8000/transaksi/receipt/receipt_${newTransactionId}.pdf`;
                const downloadResponse = await axios.get(downloadUrl, downloadConfig);

                console.log("Download response status:", downloadResponse.status);
                if (downloadResponse.status === 200) {
                    const urlBlob = window.URL.createObjectURL(new Blob([downloadResponse.data], { type: 'application/pdf' }));
                    const link = document.createElement('a');
                    link.href = urlBlob;
                    link.setAttribute('download', `receipt_${newTransactionId}.pdf`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(urlBlob);
                } else {
                    throw new Error("Gagal mendownload file, status tidak OK saat mengunduh");
                }
            } else {
                throw new Error("Gagal membuat struk, status tidak OK");
            }
        } catch (error) {
            console.error("Error saat mendownload struk:", error.message);
            alert("Error saat mendownload struk: " + error.message);
        }
    } else {
        alert("ID Transaksi tidak ditemukan");
    }
};

  
  return (
    <div>
      <Navbar />
      <div>
        <div className="bg-gray-900 pb-5">
      <div className="container px-6 py-20 mx-auto">
  <div className="items-center lg:flex">
    <div className="w-full lg:w-1/2">
      <div className="lg:max-w-lg">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
          Best place to choose <br /> your{" "}
          <span className="text-blue-500 ">FnB</span>
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro beatae
          error laborum ab amet sunt recusandae? Reiciendis natus perspiciatis
          optio.
        </p>

        <a href="#shop">
        <button className="w-full px-5 py-2 mt-6 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
          Shop Now
        </button></a>
      </div>
    </div>
    <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
      <img
        className="w-full h-full lg:max-w-3xl"
        src="https://merakiui.com/images/components/Catalogue-pana.svg"
        alt="Catalogue-pana.svg"
      />
    </div>
  </div>
</div>
</div>

        {/* Section Shop */}
        <section id="shop" className="py-10">
          <h1 className="text-center font-bold text-2xl">SHOP NOW</h1>
          <p className="text-center py-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>

          {/* Form untuk input meja, pelanggan, dan status */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex">
            <div className="w-96">
              <h2 className="text-xl w-full font-semibold mb-4 text-gray-800 dark:text-white">
                Isi Detail Transaksi
              </h2>
              {errorMessage && (
                <p className="text-red-500 mb-4">{errorMessage}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ID Meja
                  </label>

                  <input
                    type="number"
                    placeholder="ID Meja"
                    value={idMeja}
                    onChange={(e) => setIdMeja(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border text-gray-200 ${
                      occupiedTables.includes(parseInt(idMeja, 10))
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    min="1"
                    max="100"
                  />
                  {occupiedTables.includes(parseInt(idMeja, 10)) &&
                    idMeja !== "" && (
                      <p className="text-red-500 text-sm mt-1">
                        Meja ini sudah terisi.
                      </p>
                    )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nama Pelanggan
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Pelanggan"
                    value={namaPelanggan}
                    onChange={(e) => setNamaPelanggan(e.target.value)}
                    className="text-gray-200 mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="text-gray-200 mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Pilih Status</option>
                    <option value="lunas">Lunas</option>
                    <option value="belum_bayar">Belum Lunas</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tombol Checkout */}
            <div className=" mx-5 ml-10 w-96 mt-6 bg-gray-800 rounded-lg shadow-md">
              {showCheckout && (
                <div className="mt-4 border rounded-lg p-4 bg-gray-800">
                  <h2 className="text-lg font-semibold mb-4 text-gray-200">
                    Detail Pemesanan
                  </h2>
                  {menus.map(
                    (menu) =>
                      jumlahItems[menu.id_menu] > 0 && (
                        <div
                          key={menu.id_menu}
                          className="flex justify-between mb-2 text-gray-200"
                        >
                          <span className="text-gray-200">
                            {menu.nama_menu} (x{jumlahItems[menu.id_menu]})
                          </span>
                        </div>
                      )
                  )}

                  <h3 className="font-semibold mt-4 text-gray-200">
                    Total Harga: {totalHarga}
                  </h3>
                  <button
                    onClick={handleCheckout}
                    className="px-6 py-2 my-5 bg-green-600 text-white font-semibold rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={
                      occupiedTables.includes(parseInt(idMeja, 10)) || // Nonaktifkan jika meja terisi
                      !idMeja ||
                      !namaPelanggan ||
                      !status
                    }
                  >
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Popup untuk download struk */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg text-center">
              <h2 className="text-lg font-bold mb-4">Transaksi Berhasil</h2>
              <p className="mb-4">Struk sudah siap untuk diunduh.</p>
              <button
                onClick={handleDownloadStruk}
                className="bg-blue-500 text-white px-4 py-2 mr-5 rounded hover:bg-blue-600"
              >
                Download Struk
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mt-2 hover:bg-gray-400"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

          {/* Daftar Menu */}
          <div className="justify-center pt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-4 md:mx-8 lg:mx-24">
            {menus.map((menu) => (
              <div
                key={menu.id_menu}
                className="max-w-xs overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg"
              >
                <div className="px-4 py-2">
                  <h1 className="text-xl font-bold text-gray-800 dark:text-white uppercase">
                    {menu.nama_menu}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {menu.deskripsi}
                  </p>
                </div>

                <div className="flex justify-center">
                  <img
                    src={`http://localhost:8000/images/${menu.gambar}`}
                    alt={menu.nama_menu}
                    className="w-72 h-48 rounded-lg mb-3"
                  />
                </div>

                <div className="bg-gray-900">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white font-semibold">
                    <span>
                      Rp {new Intl.NumberFormat("id-ID").format(menu.harga)}
                    </span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Jumlah"
                      value={jumlahItems[menu.id_menu] || ""}
                      onChange={(e) =>
                        handleJumlahChange(menu.id_menu, e.target.value)
                      }
                      className="w-24 text-center text-gray-600 border border-gray-300 rounded-lg px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:shadow-md transition duration-200 ease-in-out"
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      className="mb-5 mt-2 w-52 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                      onClick={() => setShowCheckout(true)} // Tampilkan detail checkout
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeKasir;
