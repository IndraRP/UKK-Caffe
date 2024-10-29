import React from 'react'
import Navbar from "../component/navbar_manajer";

const homemanager = () => {
  return (
    <div>
      <Navbar/>
     <div>
     <header className="bg-white dark:bg-gray-900">
  <div className="container px-6 py-8 mx-auto">
    <div className="items-center lg:flex">
      <div className="w-full lg:w-1/2">
        <div className="lg:max-w-lg">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
           You are the <span className="text-blue-500">Manager</span>
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
          Be the best leader, organizer, communicator, decision maker, planner, supervisor{" "}
            <span className="font-medium text-blue-500">at</span> WiCaffe
          </p>
          <div className="flex flex-col mt-6 space-y-3 lg:space-y-0 lg:flex-row">
            <a href='/transaksimanajer'>
            <button className="w-full px-5 py-2 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto lg:mx-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
              Transaksi
            </button></a>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
        <img
          className="w-full h-full max-w-md"
          src="https://merakiui.com/images/components/Email-campaign-bro.svg"
          alt="email illustration vector art"
        />
      </div>
    </div>
  </div>
</header>

     </div>
    </div>
  )
}

export default homemanager