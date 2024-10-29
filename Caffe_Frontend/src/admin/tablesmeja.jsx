import React, { useEffect, useState } from 'react';
import axios from "axios";
import Navbar from "../component/navbar_admin";
import Sidebar from "../component/sidebar";
import Swal from 'sweetalert2';
import Modal from '../component/modal_meja'; // Import the modal component

const TablesMeja = () => {
    //use state menyimpan data
  const [mejas, setMejas] = useState([]);
  const [editMeja, setEditMeja] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  // Mengambil semua meja
const getMejas = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8000/meja/getAll', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Ensure the response data is an array
    const data = Array.isArray(response.data.data) ? response.data.data : [];
    setMejas(data);
  } catch (error) {
    console.error('Error saat mengambil data: ', error.response ? error.response.data : error.message);
    // In case of error, ensure mejas is set to an empty array to avoid .map errors
    setMejas([]);
  }
};


  // Menghapus meja
  const handleDelete = async (id_meja) => {
    const confirmed = await Swal.fire({
      title: 'Konfirmasi',
      text: "Apakah Anda yakin ingin menghapus meja ini?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (!confirmed.isConfirmed) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/meja/delete/${id_meja}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire('Terhapus!', 'Meja berhasil dihapus.', 'success');
      getMejas();
    } catch (error) {
      console.error('Error saat menghapus meja: ', error.response ? error.response.data : error.message);
      Swal.fire('Gagal!', 'Gagal menghapus meja.', 'error');
    }
  };

  // Mengedit meja
  const handleEdit = (meja) => {
    setEditMeja(meja);
    setIsModalOpen(true); // Open modal when editing
  };

  // Inside handleSave function
const handleSave = async () => {
  const token = localStorage.getItem('token');
  setIsModalOpen(false);
  const dataToUpdate = {
    nomor_meja: editMeja.nomor_meja,
    status: editMeja.status,
  };

  try {
    await axios.put(`http://localhost:8000/meja/update/${editMeja.id_meja}`, dataToUpdate, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    Swal.fire('Berhasil!', 'Meja berhasil diupdate.', 'success');
    setIsModalOpen(false); // Close modal after saving
    setEditMeja(null); // Clear editMeja
    getMejas(); // Refresh table data
  } catch (error) {
    console.error('Error saat mengupdate meja: ', error.response ? error.response.data : error.message);
    Swal.fire('Gagal!', 'Gagal mengupdate meja.', 'error');
  }
};

const handleSearch = async () => {
  if (!searchQuery.trim()) {
    getMejas();
    return;
  }

  const isNumeric = /^\d+$/.test(searchQuery);
  if (!isNumeric) {
    Swal.fire('Input Tidak Valid!', 'Harap masukkan nomor meja yang valid.', 'error');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8000/meja/search/${searchQuery}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Respons dari server:', response.data); // Tambahkan log untuk mengecek data

    // Jika respons API tidak mengembalikan array, maka simpan dalam array
    const mejaData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
    setMejas(mejaData);

    console.log('State meja setelah update:', mejas); // Tambahkan log untuk melihat apakah state ter-update
  } catch (error) {
    if (error.response && error.response.status === 404) {
      Swal.fire('Tidak Ditemukan!', 'Meja tidak ditemukan.', 'warning');
      setMejas([]); // Kosongkan state jika meja tidak ditemukan
    } else {
      console.error('Error saat mencari meja: ', error.response ? error.response.data : error.message);
    }
  }
};


  useEffect(() => {
    getMejas();
  }, []);

  
  return (
    <div className=''>
      <Navbar />
      <div className='flex'>
        <Sidebar />
        <div className='w-full py-10 px-10 bg-white'>
          <section className="container px-4 mx-auto">
            <div className="flex items-center gap-x-3">
              <h2 className="text-lg font-medium text-gray-800">
                Total Meja
              </h2>
              <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
                {mejas.length} meja
              </span>
            </div>

            {/* Bagian Pencarian */}
            <div className="relative mt-6 flex">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                placeholder="Cari berdasarkan Nomor Meja"
              />
              <button
                onClick={handleSearch}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Cari
              </button>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    getMejas();
                  }}
                  className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Bagian Tabel */}
            <div className="flex flex-col mt-6">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="pl-3 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">Id</th>
                          <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">Nomor Meja</th>
                          <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">Status</th>
                          <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">Action</th>
                        </tr>
                      </thead>

                      <tbody className="bg-white divide-y divide-gray-200">
  {Array.isArray(mejas) && mejas.length > 0 ? (
    mejas.map((meja, index) => (
      <tr key={index}>
        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
          <h2>{meja.id_meja}</h2>
        </td>
        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">{meja.nomor_meja}</td>
        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${
              meja.status === "kosong"
                ? "text-emerald-500 bg-emerald-100/60"
                : "text-red-500 bg-red-100/60"
            }`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="text-sm font-normal">
              {meja.status === "kosong" ? "Kosong" : "Terisi"}
            </h2>
          </div>
        </td>

        <td className="px-4 py-4 text-sm whitespace-nowrap">
          <div className="flex items-center gap-x-6">
            <button
              onClick={() => handleDelete(meja.id_meja)}
              className="text-gray-500 transition-colors duration-200 hover:text-red-500 focus:outline-none"
            >
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
              onClick={() => handleEdit(meja)}
              className="text-gray-500 transition-colors duration-200 hover:text-yellow-500 focus:outline-none"
            >
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
      <td colSpan="4" className="text-center py-4">
        Tidak ada data meja
      </td>
    </tr>
  )}
</tbody>

                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

         {/* Modal for Editing Table */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">Edit Meja</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="mb-4">
            <label htmlFor="nomor_meja" className="block text-sm font-medium text-gray-700">Nomor Meja</label>
            <input
              type="text"
              id="nomor_meja"
              value={editMeja?.nomor_meja || ''}
              onChange={(e) => setEditMeja({ ...editMeja, nomor_meja: e.target.value })}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              value={editMeja?.status || ''}
              onChange={(e) => setEditMeja({ ...editMeja, status: e.target.value })}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="kosong">Kosong</option>
              <option value="terisi">Terisi</option>
            </select>
          </div>
          <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Simpan</button>
          <button onClick={() => setIsModalOpen(false)} className="mt-4 ml-4 px-4 py-2 text-white bg-red-500 rounded">Cancel</button>
        </form>
      </Modal>

        </div>
      </div>
    </div>
  );
};

export default TablesMeja;
