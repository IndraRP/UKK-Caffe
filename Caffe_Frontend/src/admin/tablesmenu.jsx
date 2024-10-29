import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../component/navbar_admin";
import Sidebar from "../component/sidebar";
import Modal from "../component/modal"; // Import the Modal component

const TablesMenu = () => {
  const [menus, setMenus] = useState([]); // State untuk menyimpan data menu
  const [editMenu, setEditMenu] = useState(null); // State untuk menyimpan data menu yang sedang diedit
  const [filterJenis, setFilterJenis] = useState(""); // State untuk filter 'jenis'
  const [errorMessage, setErrorMessage] = useState(""); // State untuk pesan error
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling the modal visibility

  // Fungsi untuk mengambil data menu dari backend
  const getMenus = async () => {
    try {
      const token = localStorage.getItem("token"); // Mengambil token dari localStorage
      const response = await axios.get("http://localhost:8000/menu/getAll", {
        headers: {
          Authorization: `Bearer ${token}`, // Menyertakan token di header
        },
      });
      setMenus(response.data.data);
    } catch (error) {
      console.error(
        "Error fetching data: ",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Fungsi untuk menghapus menu
  const handleDelete = async (id_menu) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus menu ini?"
    );
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8000/menu/delete/${id_menu}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Menu berhasil dihapus");
      getMenus(); // Memperbarui daftar menu setelah penghapusan
    } catch (error) {
      console.error(
        "Error deleting menu: ",
        error.response ? error.response.data : error.message
      );
    }
  };
  const handleEdit = (menu) => {
    setEditMenu(menu);
    setErrorMessage("");
    setIsModalOpen(true); // Open the modal when editing
  };

  const handleSave = async () => {
    setIsModalOpen(false);
    if (!editMenu.nama_menu || !editMenu.jenis || !editMenu.harga) {
      setErrorMessage("Semua field harus diisi.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("nama_menu", editMenu.nama_menu);
    formData.append("jenis", editMenu.jenis);
    formData.append("deskripsi", editMenu.deskripsi);
    formData.append("harga", editMenu.harga);
    if (editMenu.gambar instanceof File) {
      formData.append("gambar", editMenu.gambar);
    }

    try {
      await axios.put(
        `http://localhost:8000/menu/update/${editMenu.id_menu}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Menu berhasil diupdate");
      setEditMenu(null);
      setErrorMessage("");
      setIsModalOpen(false); // Close the modal after saving
      getMenus();
    } catch (error) {
      const message = error.response ? error.response.data.message : error.message;
      console.error("Error updating menu: ", message);
      setErrorMessage(message);
    }
  };

  // Fungsi untuk melakukan filter menu
  const handleFilter = async () => {
    const token = localStorage.getItem("token");
    const payload = {};

    if (filterJenis.trim()) {
      payload.jenis = filterJenis;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/menu/filter",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        setMenus(response.data.data);
        setErrorMessage(""); // Reset pesan error jika filter sukses
      } else {
        setMenus([]); // Tidak ada menu ditemukan
        setErrorMessage(
          response.data.message || "Tidak ada menu yang ditemukan."
        );
      }
    } catch (error) {
      console.error(
        "Error filtering menus: ",
        error.response ? error.response.data : error.message
      );
      setMenus([]); // Set ke array kosong jika terjadi error
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      );
    }
  };

  // Fungsi untuk mereset filter dan menampilkan semua menu
  const handleResetFilter = () => {
    setFilterJenis("");
    setErrorMessage("");
    getMenus();
  };

  // Mengambil data ketika komponen pertama kali dimount
  useEffect(() => {
    getMenus();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="w-full py-10 px-10 bg-white">
          <section className="container px-4 mx-auto">
            <div className="flex items-center gap-x-3">
              <h2 className="text-lg font-medium text-gray-800">Total Menu</h2>
              <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
                {menus.length} menu
              </span>
            </div>

            {/* Bagian Filter */}
            <div className="mt-6 p-4 bg-gray-50 hover:bg-gray-200 rounded-md">
              <h3 className="text-md font-medium text-gray-800">Filter Menu</h3>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 ">
                {/* Filter Jenis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Jenis
                  </label>
                  <select
                    value={filterJenis}
                    onChange={(e) => setFilterJenis(e.target.value)}
                    className="mt-1 block w-full p-2 border rounded-md bg-white text-gray-700"
                  >
                    <option value="">Semua Jenis</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    {/* Tambahkan opsi lain sesuai kebutuhan */}
                  </select>
                </div>
              </div>

              {/* Tombol Filter dan Reset */}
              <div className="mt-4 flex gap-4">
                <button
                  onClick={handleFilter}
                  className="px-4 py-2 text-white bg-blue-500 rounded"
                >
                  Apply Filter
                </button>
                <button
                  onClick={handleResetFilter}
                  className="px-4 py-2 text-white bg-gray-500 rounded"
                >
                  Reset Filter
                </button>
              </div>
            </div>

            {/* Menampilkan Pesan Error */}
            {errorMessage && (
              <div
                className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg mt-4"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col mt-6">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="pl-3 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                            Id
                          </th>
                          <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                            Gambar
                          </th>
                          <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                            Nama Menu
                          </th>
                          <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                            Jenis
                          </th>
                          <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                            Harga
                          </th>
                          <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody className="bg-white divide-y divide-gray-200">
                        {menus.map((menu, index) => (
                          <tr key={menu.id_menu}>
                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                              <h2>{menu.id_menu}</h2>
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                              {menu.gambar ? (
                                <img
                                  src={`http://localhost:8000/images/${menu.gambar}`}
                                  alt={menu.nama_menu}
                                  className="w-16 h-16 object-cover rounded-full"
                                />
                              ) : (
                                <span>No image available</span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {menu.nama_menu}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {menu.jenis}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                              Rp {new Intl.NumberFormat('id-ID').format(menu.harga)}
                            </td>

                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                              <div className="flex items-center gap-x-6">
                                <button
                                  onClick={() => handleDelete(menu.id_menu)}
                                  className="text-gray-500 transition-colors duration-200 hover:text-red-500 focus:outline-none"
                                >
                                  {/* SVG Icon untuk Delete */}
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
                                  onClick={() => handleEdit(menu)}
                                  className="text-gray-500 transition-colors duration-200 hover:text-yellow-500 focus:outline-none"
                                >
                                  {/* SVG Icon untuk Edit */}
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
                        ))}
                      </tbody>
                    </table>

                    {/* Modal for Editing Menu */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h3 className="text-lg font-medium">Edit Menu</h3>
            {errorMessage && (
              <div
                className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg mt-4"
                role="alert"
              >
                {errorMessage}
              </div>
            )}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Nama Menu"
                value={editMenu ? editMenu.nama_menu : ""}
                onChange={(e) =>
                  setEditMenu({ ...editMenu, nama_menu: e.target.value })
                }
                className="block w-full p-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Jenis"
                value={editMenu ? editMenu.jenis : ""}
                onChange={(e) =>
                  setEditMenu({ ...editMenu, jenis: e.target.value })
                }
                className="mt-2 block w-full p-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Deskripsi"
                value={editMenu ? editMenu.deskripsi : ""}
                onChange={(e) =>
                  setEditMenu({ ...editMenu, deskripsi: e.target.value })
                }
                className="mt-2 block w-full p-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Harga"
                value={editMenu ? editMenu.harga : ""}
                onChange={(e) =>
                  setEditMenu({ ...editMenu, harga: e.target.value })
                }
                className="mt-2 block w-full p-2 border rounded-md"
              />
              <input
                type="file"
                onChange={(e) =>
                  setEditMenu({ ...editMenu, gambar: e.target.files[0] })
                }
                className="mt-2 block w-full"
              />
            </div>
            <div className="mt-4">
              <button onClick={handleSave}className="px-4 py-2 text-white bg-blue-500 rounded">Save Changes</button>
              <button onClick={() => setIsModalOpen(false)} className="mt-4 ml-4 px-4 py-2 text-white bg-red-500 rounded">Cancel</button>
            </div>
          </Modal>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TablesMenu;
