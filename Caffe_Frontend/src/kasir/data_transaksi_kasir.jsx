import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../component/navbar_kasir";
import Swal from "sweetalert2"; // Import SweetAlert2

const HomeKasir = () => {
    //use state menyimpan data
  const [transaksi, setTransaksi] = useState([]);
  const [error, setError] = useState(null);
  const bearerToken = localStorage.getItem("token");

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

  return (
    <div>
      <Navbar />
      <div className="flex flex-col mt-6 min-h-screen">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                      Delete
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
                          {item.detail.map((detail, index) => (
                            <div key={index}>{detail.menu.nama_menu}</div>
                          ))}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
                          {item.detail.map((detail, index) => (
                            <div key={index}>{detail.jumlah}</div>
                          ))}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
                          {item.detail.map((detail, index) => (
                            <div key={index}>
                              Rp {detail.harga.toLocaleString()}
                            </div>
                          ))}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
                          {item.status}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-center">
                          Rp{" "}
                          {item.detail
                            .reduce(
                              (total, detail) =>
                                total + detail.jumlah * detail.harga,
                              0
                            )
                            .toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex items-center justify-center gap-x-6">
                            <button onClick={() => deleteTransaksi(item.id_transaksi)}
                              className="text-gray-500 transition-colors duration-200 hover:text-red-500 focus:outline-none">
                              {/* Ikon Hapus */}
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
