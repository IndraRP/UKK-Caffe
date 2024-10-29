import React from 'react';
import Navbar from "../component/navbar"; // Pastikan Navbar telah diimpor dengan benar

import Gambar from "./image/bg4.jpg"; // Pastikan gambar login-bg.png ada di folder yang benar

const Login = () => {
  return (
    <div>       
        <Navbar />
    <div className="relative py-16">
      <img src={Gambar} alt="login image" className="absolute inset-0 w-full h-full object-cover" />

      <form className="relative z-10 flex flex-col items-center justify-center h-full bg-black bg-opacity-30 p-8 rounded-lg max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Register</h1>

        <div className="flex flex-col space-y-6 w-full">
          <div className="flex items-center border-b-2 border-white pb-2">
            <i className="ri-user-3-line text-white text-xl mr-2"></i>
            <div className="relative w-full">
              <input type="email" required className="bg-transparent outline-none text-white placeholder-transparent w-full py-2" id="login-email" placeholder=" " />
              <label htmlFor="login-email" className="absolute left-0 text-white transition-all duration-300 transform -translate-y-3 scale-75 origin-top-left">Email</label>
            </div>
          </div>

          <div className="flex items-center border-b-2 border-white">
            <i className="ri-lock-2-line text-white text-xl mr-2"></i>
            <div className="relative w-full">
              <input type="password" required className="bg-transparent outline-none text-white placeholder-transparent border-none w-full py-2" id="login-pass" placeholder=" " />
              <label htmlFor="login-email" className="absolute left-0 text-white transition-all duration-300 transform -translate-y-3 scale-75 origin-top-left">Password</label>
              <i className="ri-eye-off-line absolute right-0 top-3 z-10 cursor-pointer"></i>
            </div>
          </div>

          <div className="flex items-center border-b-2 border-white">
            <i className="ri-lock-2-line text-white text-xl mr-2"></i>
            <div className="relative w-full">
              <input type="password" required className="bg-transparent outline-none text-white placeholder-transparent border-none w-full py-2" id="login-pass" placeholder=" " />
              <label htmlFor="login-email" className="absolute left-0 text-white transition-all duration-300 transform -translate-y-3 scale-75 origin-top-left">Confirm Password</label>
              <i className="ri-eye-off-line absolute right-0 top-3 z-10 cursor-pointer"></i>
            </div>
          </div>

        </div>

    

        <button type="submit" className="w-full py-2 mt-8 bg-white text-black font-medium rounded hover:bg-gray-200 transition duration-300">Login</button>

        <p className="text-white mt-4">Don't have an account? <a href="#" className="text-white font-medium hover:underline">Register</a></p>
      </form>
    </div>
    </div>
  );
};

export default Login;
