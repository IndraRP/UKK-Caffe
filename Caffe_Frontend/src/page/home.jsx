import React from 'react'
import Navbar from "../component/navbar"

const home = () => {
  return (
    <div>
        <Navbar/>
        <section className="bg-white dark:bg-gray-900">

  <div className="container flex flex-col px-6 py-10 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row lg:items-center">
    <div className="w-full lg:w-1/2">
      <div className="lg:max-w-lg">
        <h1 className="text-3xl font-bold tracking-wide text-gray-800 dark:text-white lg:text-4xl">
          Easiest way to create your future
        </h1>

        <div className="mt-8 space-y-5">
          <p className="flex items-center -mx-2 text-gray-700 dark:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="mx-2">Clean and Simple Layout</span>
          </p>
          
          <p className="flex items-center -mx-2 text-gray-700 dark:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="mx-2">Just Copy Paste Coding</span>
          </p>

          <p className="flex items-center -mx-2 text-gray-700 dark:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="mx-2">Easy to Use</span>
          </p>
        </div>
      </div>

     </div>
    <div className="flex items-center justify-center w-full h-96 lg:w-1/2">
      <img
        className="object-cover w-full h-full mx-auto rounded-md lg:max-w-2xl"
        src="https://images.unsplash.com/photo-1543269664-7eef42226a21?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
        alt="glasses photo"
      />
    </div>
  </div>
</section>

    </div>
  )
}

export default home