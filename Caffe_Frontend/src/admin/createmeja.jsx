import React, { useState } from "react";
import axios from "axios";
import Navbar from "../component/navbar_admin";
import Sidebar from "../component/sidebar";

const Create = () => {
    //use state menyimpan data
  const [formData, setFormData] = useState({
    nomor_meja: "",
    status: "kosong"
  });

  const validateForm = () => {
    const { nomor_meja, status } = formData;
    if (!nomor_meja || !status) {
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
  
    // Kirim data sebagai objek JSON
    try {
      const response = await axios.post("http://localhost:8000/meja/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Menggunakan JSON
        },
      });
      console.log("Data berhasil ditambahkan:", response.data);
      alert("Data berhasil ditambahkan!");
      setFormData({
        nomor_meja: "",
        status: "kosong"
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
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <section className="pt-5 w-full my-20">
          <div className="flex justify-center">
            <div className="w-full max-w-xl">
              <div className="mb-3 bg-slate-100 hover:bg-slate-200 rounded-lg shadow p-7">
                <form onSubmit={handleSubmit} className="px-5">
                  <h1 className="text-center font-bold text-lg mb-5">FORM CREATE MEJA</h1>

                  {/* Render input fields */}
                  {[
                    { id: "nomor_meja", label: "Nomor Meja", type: "number", placeholder: "Masukkan Nomor Meja" },
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
                        required
                      />
                    </div>
                  ))}

                  <div className="mb-4">
                    <label htmlFor="status" className="text-gray-700">Status:</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="form-control w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                      required
                    >
                      <option value="kosong">Kosong</option>
                      <option value="terisi">Terisi</option>
                    </select>
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
