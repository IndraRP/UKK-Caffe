import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../component/navbar_manajer";
import Swal from "sweetalert2"; // Import SweetAlert2

const HomeKasir = () => {
  //use state menyimpan data
  const [transaksi, setTransaksi] = useState([]);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransaksi, setCurrentTransaksi] = useState(null);
  const bearerToken = localStorage.getItem("token");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchTransaksi = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/transaksi/getAll",
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        if (response.data.success) {
          setTransaksi(response.data.data);
        } else {
          setError("Gagal mendapatkan data transaksi");
        }
      } catch (error) {
        setError(
          error.response?.data?.message || "Terjadi kesalahan saat mengambil data"
        );
        console.error("Error fetching transaksi:", error);
      }
    };

    fetchTransaksi();
  }, [bearerToken]);

  const handleEditClick = (item) => {
    setCurrentTransaksi(item);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTransaksi((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/transaksi/update/${currentTransaksi.id_transaksi}`,
        currentTransaksi,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      if (response.data.success) {
        setTransaksi((prev) =>
          prev.map((trans) =>
            trans.id_transaksi === currentTransaksi.id_transaksi
              ? currentTransaksi
              : trans
          )
        );
        setIsEditing(false);
        setCurrentTransaksi(null);
      } else {
        setError("Gagal memperbarui transaksi");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Terjadi kesalahan saat mengupdate transaksi"
      );
      console.error("Error updating transaksi:", error);
    }
  };

  const deleteTransaksi = async (id) => {
    const confirmed = await Swal.fire({
      title: 'Konfirmasi',
      text: "Apakah Anda yakin ingin menghapus transaksi ini?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (confirmed.isConfirmed) {
      console.log("Menghapus transaksi dengan ID:", id); // Log ID transaksi yang akan dihapus
      try {
        const response = await axios.delete(`http://localhost:8000/transaksi/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        if (response.data.success) {
          Swal.fire('Terhapus!', 'Transaksi berhasil dihapus!', 'success');
          setTransaksi((prev) => prev.filter((trans) => trans.id_transaksi !== id));
        } else {
          Swal.fire('Gagal!', 'Gagal menghapus transaksi!', 'error');
        }
      } catch (error) {
        console.error('Error deleting transaksi:', error.response || error);
        Swal.fire('Gagal!', error.response?.data?.message || 'Gagal menghapus transaksi!', 'error');
      }
    }
  };

  const filter = async () => {
    if (!startDate || !endDate) {
      setError("Harap masukkan kedua tanggal.");
      return;
    }
  
    try {
      const response = await axios.get(
        `http://localhost:8000/transaksi/filtertanggal/${startDate}/${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      if (response.data.success) {
        setTransaksi(response.data.data);
      } else {
        setError("Gagal mendapatkan data transaksi");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Terjadi kesalahan saat mengambil data"
      );
      console.error("Error fetching transaksi:", error);
    }
  };
  

  return (
    <div>
      <Navbar />
      <div className="flex flex-col min-h-screen">

        <div className="bg-gray-800 mt-5 py-3 text-xs rounded-md mx-96">
          <div className="flex justify-center">
      <div className="mx-3 my-2">
        <label htmlFor="startDate" className="font-semibold text-white">Tanggal Mulai</label>
        <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="block w-full p-2 border mt-1 rounded-md"/>
      </div>

      <div className="mx-3 my-2">
        <label htmlFor="endDate" className="font-semibold text-white">Tanggal Akhir</label>
        <input type="date" id="endDate" value={endDate}  onChange={(e) => setEndDate(e.target.value)}  className="block w-full p-2 border mt-1 rounded-md"/>
      </div>
      </div>

<div className="flex justify-center items-center">
  <button onClick={filter} className="mt-2 bg-blue-500 text-white px-4 py-2 h-10 rounded-3xl">
    Filter Transaksi
  </button>
</div>

      </div>

        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg mx-5 my-5">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3.5 text-sm font-normal text-center text-gray-500">
                      Id
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-center text-gray-500">
                      Tanggal
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-center text-gray-500">
                      Nama Pelanggan
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-center text-gray-500">
                      Meja
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-center text-gray-500">
                      Menu
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-center text-gray-500">
                      Jumlah
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-center text-gray-500">
                      Harga
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-center text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-center text-gray-500">
                      Total Harga
                    </th>
                    <th className="px-4 py-3.5 text-sm font-normal text-center text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
  {transaksi.length > 0 ? (
    transaksi.map((item) => (
      <tr key={item.id_transaksi}>
        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
          {item.id_transaksi}
        </td>
        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
          {new Date(item.tgl_transaksi).toLocaleDateString()}
        </td>
        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
          {item.nama_pelanggan}
        </td>
        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
          {item.meja.nomor_meja}
        </td>
        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
          {Array.isArray(item.detail) && item.detail.length > 0 ? (
            item.detail.map((detail, index) => (
              <div key={index}>{detail.menu.nama_menu}</div>
            ))
          ) : (
            <div>Tidak ada detail</div>
          )}
        </td>
        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
          {Array.isArray(item.detail) && item.detail.length > 0 ? (
            item.detail.map((detail, index) => (
              <div key={index}>{detail.jumlah}</div>
            ))
          ) : (
            <div>Tidak ada detail</div>
          )}
        </td>
        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
          {Array.isArray(item.detail) && item.detail.length > 0 ? (
            item.detail.map((detail, index) => (
              <div key={index}>
                Rp {detail.harga.toLocaleString()}
              </div>
            ))
          ) : (
            <div>Tidak ada detail</div>
          )}
        </td>
        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
          {item.status}
        </td>
        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
          Rp{" "}
          {Array.isArray(item.detail) && item.detail.length > 0
            ? item.detail
                .reduce(
                  (total, detail) => total + detail.jumlah * detail.harga,
                  0
                )
                .toLocaleString()
            : "0"}
        </td>
        <td className="px-4 py-4 text-sm whitespace-nowrap">
          <div className="flex items-center justify-center gap-x-6">
            <button
              onClick={() => deleteTransaksi(item.id_transaksi)}
              className="text-gray-500 transition-colors duration-200 hover:text-red-500 focus:outline-none"
            >
              {/* Ikon Hapus */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
            <button
              onClick={() => handleEditClick(item)}
              className="text-gray-500 transition-colors duration-200 hover:text-yellow-500 focus:outline-none"
            >
              {/* Ikon Edit */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="10" className="px-4 py-4 text-sm text-center">
        Tidak ada data transaksi.
      </td>
    </tr>
  )}
</tbody>

              </table>
              {isEditing && (
                <form onSubmit={handleSubmit} className="p-4">
                  <h2 className="text-lg font-semibold mb-2">Edit Transaksi</h2>
                  {/* Form fields */}
                  <div>
                    <label htmlFor="nama_pelanggan">Nama Pelanggan</label>
                    <input
                      id="nama_pelanggan"
                      name="nama_pelanggan"
                      value={currentTransaksi.nama_pelanggan}
                      onChange={handleChange}
                      className="block w-full p-2 border"
                    />
                  </div>
                  {/* Tambahkan field lain sesuai kebutuhan */}
                  <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2">
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="ml-2 bg-gray-500 text-white px-4 py-2"
                  >
                    Batal
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-center">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default HomeKasir;
