import React, { useState } from "react";
import axios from "axios";
import Navbar from "../component/navbar_admin";
import Sidebar from "../component/sidebar";

const Create = () => {
    //use state menyimpan data
  const [formData, setFormData] = useState({
    nama_menu: "",
    jenis: "makanan",
    deskripsi: "",
    gambar: null,
    harga: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      gambar: e.target.files[0],
    }));
  };

  const validateForm = () => {
    const { nama_menu, deskripsi, harga, gambar } = formData;
    if (!nama_menu || !deskripsi || !harga || !gambar) {
      alert("Semua field harus diisi!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login kembali.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("nama_menu", formData.nama_menu);
    formDataToSend.append("jenis", formData.jenis);
    formDataToSend.append("deskripsi", formData.deskripsi);
    formDataToSend.append("gambar", formData.gambar);
    formDataToSend.append("harga", formData.harga);

    try {
      const response = await axios.post("http://localhost:8000/menu/add", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Data berhasil ditambahkan:", response.data);
      alert("Data berhasil ditambahkan!");
      setFormData({
        nama_menu: "",
        jenis: "makanan",
        deskripsi: "",
        gambar: null,
        harga: "",
      });
    } catch (error) {
      console.error("Error menambahkan data:", error);
      if (error.response) {
        alert(`Terjadi kesalahan: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        alert("Tidak ada respons dari server. Silakan coba lagi nanti.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <section className="pt-5 w-full my-10">
          <div className="flex justify-center">
            <div className="w-full max-w-xl">
              <div className="mb-3 bg-slate-100 hover:bg-slate-200 rounded-lg shadow p-7">
                <form onSubmit={handleSubmit} className="px-5">
                  <h1 className="text-center font-bold text-lg mb-5">FORM CREATE MENU</h1>

                  {/* Render input fields */}
                  {[
                    { id: "nama_menu", label: "Nama Menu", type: "text", placeholder: "Masukkan Nama Menu" },
                    { id: "deskripsi", label: "Deskripsi", type: "text", placeholder: "Masukkan Deskripsi" },
                    { id: "harga", label: "Harga", type: "text", placeholder: "Masukkan Harga" },
                  ].map((input) => (
                    <div key={input.id} className="mb-4">
                      <label htmlFor={input.id} className="text-gray-700">{input.label}:</label>
                      <input
                        type={input.type}
                        id={input.id}
                        name={input.id}
                        value={formData[input.id]}
                        onChange={handleChange}
                        className="form-control w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder={input.placeholder}
                      />
                    </div>
                  ))}

                  <div className="mb-4">
                    <label htmlFor="jenis" className="text-gray-700">Jenis:</label>
                    <select
                      id="jenis"
                      name="jenis"
                      value={formData.jenis}
                      onChange={handleChange}
                      className="form-control w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    >
                      <option value="makanan">Makanan</option>
                      <option value="minuman">Minuman</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="gambar" className="text-gray-700">Gambar:</label>
                    <input
                      type="file"
                      id="gambar"
                      name="gambar"
                      onChange={handleFileChange}
                      className="form-control w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>

                  <div className="flex justify-center items-center mt-4 py-2">
                    <button
                      className="justify-center px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 hover:font-bold focus:outline-none focus:ring focus:ring-blue-300"
                      type="submit"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Create;