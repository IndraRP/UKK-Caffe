import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Tambahkan axios untuk API call

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');

  // Mengambil username dari localStorage saat komponen di-mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Kirim permintaan logout ke API
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/user/logout', 
        {}, // jika body tidak diperlukan, bisa kosong
        {
          headers: {
            Authorization: `Bearer ${token}` // Sertakan token dalam header
          }
        }
      );

      // Hapus token dan username dari localStorage setelah logout berhasil
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/'; // Redirect ke halaman login
    } catch (error) {
      console.error("Error during logout:", error);
      // Tambahkan pesan error jika dibutuhkan
    }
  };

  return (
    <nav className="relative bg-white shadow dark:bg-gray-900 w-screen">
      <div className="container px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          <a href="/admin">
            <h1 className='text-white font-extrabold font-mono text-lg'>WiCaffe_Admin</h1>
          </a>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
              aria-label="toggle menu"
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center ${
            isOpen ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full'
          }`}
        >
          <div className="flex flex-col md:flex-row md:mx-6 items-center">
            <a className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="/admin">
              Home
            </a>
            <a className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="/admin/menu/create">
              Menu
            </a>
            <a className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="/admin/meja/create">
              Meja
            </a>
            <a className="my-2 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="/admin/user/create">
              User
            </a>
            
            {/* Dropdown untuk menampilkan username dan logout */}
            <div className="relative ml-10">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
              {isOpen && (
                <ul className="absolute right-0 z-20 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg text-sm">
                  <li className="px-4 py-2 text-gray-700">{username}</li>
                  <li className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100 text-sm font-bold" onClick={handleLogout}>
                    Logout
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
