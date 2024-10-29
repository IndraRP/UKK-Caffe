import React, { useEffect, useState } from 'react';
import axios from "axios";
import Navbar from "../component/navbar_admin";
import Sidebar from "../component/sidebar";
import Modal from "../component/modal_user"; // Adjust the path as necessary

const TablesUser = () => {
  const [users, setUsers] = useState([]); // State untuk menyimpan data user
  const [editUser, setEditUser] = useState(null); // State untuk menyimpan data user yang sedang diedit
  const [searchText, setSearchText] = useState(''); // State untuk menyimpan input pencarian
  const [errorMessage, setErrorMessage] = useState(''); // State untuk menyimpan pesan error
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  // Fungsi untuk mengambil data user dari backend
  const getUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Mengambil token dari localStorage
      const response = await axios.get('http://localhost:8000/user/allUser', {
        headers: {
          Authorization: `Bearer ${token}`, // Menyertakan token di header
        },
      });
      console.log('API response:', response.data); // Debugging

      // Sesuaikan sesuai struktur respons API
      if (response.data && Array.isArray(response.data.success)) {
        setUsers(response.data.success);
      } else {
        console.warn('Unexpected API response structure:', response.data);
        setUsers([]); // Set ke array kosong jika struktur tidak sesuai
      }
    } catch (error) {
      console.error('Error fetching data: ', error.response ? error.response.data : error.message);
      setUsers([]); // Set ke array kosong jika terjadi error
    }
  };

  // Fungsi untuk menghapus user
  const handleDelete = async (id_user) => {
    const confirmed = window.confirm("Apakah Anda yakin ingin menghapus user ini?");
    if (!confirmed) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/user/delete/${id_user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User berhasil dihapus');
      getUsers(); // Memperbarui daftar user setelah penghapusan
    } catch (error) {
      console.error('Error deleting user: ', error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (user) => {
    setEditUser ({ ...user, oldPassword: '', password: '' });
    setErrorMessage('');
    setIsModalOpen(true); // Open modal when editing
  };

  // Fungsi untuk menyimpan perubahan setelah edit
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    setIsModalOpen(false);
    const payload = {
      nama_user: editUser.nama_user,
      role: editUser.role,
      username: editUser.username,
    };
  
    if (editUser.password) {
      if (!editUser.oldPassword) {
        alert("Harap isi Password Lama jika ingin mengganti password.");
        return;
      }
      payload.oldPassword = editUser.oldPassword;
      payload.password = editUser.password;
    }
  
    try {
      await axios.put(`http://localhost:8000/user/update/${editUser.id_user}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('User berhasil diupdate');
      alert("User berhasil diupdate"); // Menampilkan alert ketika berhasil diupdate
      setEditUser(null);
      setErrorMessage('');
      getUsers();
    } catch (error) {
      const message = error.response ? error.response.data.message : error.message;
      console.error('Error updating user: ', message);
      setErrorMessage(message);
    }
  };
  

  // Fungsi untuk melakukan pencarian user
  const handleSearch = async () => {
    if (!searchText.trim()) {
      alert("Harap masukkan kata kunci pencarian.");
      return;
    }

    const token = localStorage.getItem('token');
    const payload = {
      nama_user: searchText,
      username: searchText,
    };

    try {
      const response = await axios.post('http://localhost:8000/user/search', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setUsers(response.data.data);
        setErrorMessage(''); // Reset pesan error jika pencarian sukses
      } else {
        setUsers([]); // Tidak ada pengguna ditemukan
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error searching users: ', error.response ? error.response.data : error.message);
      setUsers([]); // Set ke array kosong jika terjadi error
      setErrorMessage(error.response ? error.response.data.message : error.message);
    }
  };

  // Fungsi untuk mereset pencarian dan menampilkan semua pengguna
  const handleReset = () => {
    setSearchText('');
    setErrorMessage('');
    getUsers();
  };

  // Mengambil data ketika komponen pertama kali dimount
  useEffect(() => {
    getUsers();
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
                Total Users
              </h2>
              <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
                {users ? users.length : 0} user
              </span>
            </div>

            {/* Bagian Pencarian */}
            <div className="relative mt-6 flex items-center">
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
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                placeholder="Search by Nama User or Username"
              />
              <button onClick={handleSearch} className="ml-2 px-4 py-2 text-white bg-blue-500 rounded">
                Search
              </button>
              <button onClick={handleReset} className="ml-2 px-4 py-2 text-white bg-gray-500 rounded">
                Reset
              </button>
            </div>

            {/* Menampilkan Pesan Error */}
            {errorMessage && (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
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
                          <th className="pl-3 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">ID</th>
                          <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">Nama User</th>
                          <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">Role</th>
                          <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">Username</th>
                          <th className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500">Action</th>
                        </tr>
                      </thead>

                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                              <h2>{user.id_user}</h2>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {user.nama_user}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {user.role}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {user.username}
                            </td>
                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                              <div className="flex items-center gap-x-6">
                                <button onClick={() => handleDelete(user.id_user)} className="text-gray-500 transition-colors duration-200 hover:text-red-500 focus:outline-none">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </button>
                                <button onClick={() => handleEdit(user)} className="text-gray-500 transition-colors duration-200 hover:text-yellow-500 focus:outline-none">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <h3 className="text-lg font-medium text-gray-800">Edit User</h3>
  <div className="mt-2">
    <input
      type="text"
      value={editUser ?.nama_user || ''}
      onChange={(e) => setEditUser ({ ...editUser , nama_user: e.target.value })}
      placeholder="Nama User"
      className="w-full p-2 border rounded mt-2"
    />
    <input
      type="text"
      value={editUser ?.role || ''}
      onChange={(e) => setEditUser ({ ...editUser , role: e.target.value })}
      placeholder="Role"
      className="w-full p-2 border rounded mt-2"
    />
    <input
      type="text"
      value={editUser ?.username || ''}
      onChange={(e) => setEditUser ({ ...editUser , username: e.target.value })}
      placeholder="Username"
      className="w-full p-2 border rounded mt-2"
    />
    <input
      type="password"
      value={editUser ?.oldPassword || ''}
      onChange={(e) => setEditUser ({ ...editUser , oldPassword: e.target.value })}
      placeholder="Password Lama (hanya jika mengganti password)"
      className="w-full p-2 border rounded mt-2"
    />
    <input
      type="password"
      value={editUser ?.password || ''}
      onChange={(e) => setEditUser ({ ...editUser , password: e.target.value })}
      placeholder="Password Baru (kosongkan jika tidak ingin mengganti)"
      className="w-full p-2 border rounded mt-2"
    />
    <button onClick={handleSave} className="mt-4 px-4 py-2 text-white bg-blue-500 rounded">
      Save Changes
    </button>
    <button onClick={() => setIsModalOpen(false)} className="mt-4 ml-4 px-4 py-2 text-white bg-red-500 rounded">
      Cancel
    </button>
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

export default TablesUser;
