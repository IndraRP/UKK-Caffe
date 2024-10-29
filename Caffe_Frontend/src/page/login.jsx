import React, { useState } from 'react';
import Navbar from "../component/navbar";
import Gambar from "./image/login-bg.png";
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/user/login", {
        username,
        password,
      });
  
      if (response.status === 200) {
        console.log("Login berhasil:", response.data);
        
        // Menyimpan token dan username ke localStorage
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("username", response.data.data.username); // Menyimpan username
  
        const role = response.data.data.role;
        if (role === "admin") {
          window.location.href = "/admin";
        } else if (role === "kasir") {
          window.location.href = "/kasir";
        } else if (role === "manajer") {
          window.location.href = "/manajer";
        } else {
          setErrorMessage("Role tidak dikenal");
        }
      } 
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setErrorMessage(error.response?.data?.message || "Terjadi kesalahan saat login.");
    }
  };
  

  return (
    <div>
      <Navbar />
      <div className="relative py-20">
        <img src={Gambar} alt="login image" className="absolute inset-0 w-full h-full object-cover" />

        <form onSubmit={handleLogin} className="py-12 relative z-10 flex flex-col items-center justify-center h-full bg-black bg-opacity-30 p-8 rounded-lg max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Login</h1>

          {errorMessage && (
            <div className="bg-red-500 text-white px-4 py-2 rounded mb-4 w-full text-center">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col space-y-6 w-full">
            <div className="flex items-center border-b-2 border-white pb-2">
              <i className="ri-user-3-line text-white text-xl mr-2"></i>
              <div className="relative w-full">
                <input 
                  type="text" 
                  required 
                  className="bg-transparent outline-none text-white placeholder-transparent w-full py-2" 
                  id="login-username" 
                  placeholder=" " 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="login-username" className="absolute left-0 text-white transition-all duration-300 transform -translate-y-3 scale-75 origin-top-left">Username</label>
              </div>
            </div>

            <div className="flex items-center border-b-2 border-white">
              <i className="ri-lock-2-line text-white text-xl mr-2"></i>
              <div className="relative w-full">
                <input 
                  type="password" 
                  required 
                  className="bg-transparent outline-none text-white placeholder-transparent border-none w-full py-2" 
                  id="login-pass" 
                  placeholder=" " 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="login-pass" className="absolute left-0 text-white transition-all duration-300 transform -translate-y-3 scale-75 origin-top-left">Password</label>
                <i className="ri-eye-off-line absolute right-0 top-3 z-10 cursor-pointer"></i>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between w-full mt-4 mb-6">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-white border-white rounded" id="login-check" />
              <label htmlFor="login-check" className="text-white ml-2 text-sm">Remember me</label>
            </div>
          </div>

          <button type="submit" className="w-full py-2 bg-white text-black font-medium rounded hover:bg-gray-200 transition duration-300">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
