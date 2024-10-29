import React from 'react'

const footer = () => {
  return (
    <div><footer className="bg-gray-900">
    <div className="container px-6 py-8 mx-auto">
      <div className="flex flex-col items-center text-center">
        <div className="flex flex-wrap justify-center mt-1 -mx-4">
          <a
            href="#"
            className="mx-4 text-sm text-gray-100 transition-colors duration-300 hover:text-blue-500"
            aria-label="Reddit"
          >
            {" "}
            Home{" "}
          </a>

          <a
            href="#"
            className="mx-4 text-sm text-gray-100 transition-colors duration-300 hover:text-blue-500 "
            aria-label="Reddit"
          >
            {" "}
            About{" "}
          </a>

          <a
            href="#"
            className="mx-4 text-sm text-gray-100 transition-colors duration-300 hover:text-blue-500"
            aria-label="Reddit"
          >
            {" "}
            Shop{" "}
          </a>

          <a
            href="#"
            className="mx-4 text-sm text-gray-100 transition-colors duration-300 hover:text-blue-500"
            aria-label="Reddit"
          >
            {" "}
            Contact{" "}
          </a>
        </div>
      </div>

      <hr className="my-6 border-gray-200 md:my-4 " />

      <div className="flex flex-col items-center sm:flex-row sm:justify-between">
        <p className="text-sm text-gray-100">
          © Copyright 2021. All Rights Reserved.
        </p>

        <div className="flex -mx-2 mt-4">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/indra.rrpratama/"
            className="mx-2"
            aria-label="Instagram"
          >
            <svg
              class="h-6 w-6 text-blue-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <rect x="4" y="4" width="16" height="16" rx="4" />{" "}
              <circle cx="12" cy="12" r="3" />{" "}
              <line x1="16.5" y1="7.5" x2="16.5" y2="7.501" />
            </svg>
          </a>

          {/* Github */}
          <a
            href="https://github.com/IndraRP"
            className="mx-2"
            aria-label="Github"
          >
            <svg
              class="h-6 w-6 text-blue-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <path d="M9 19c-4.286 1.35-4.286-2.55-6-3m12 5v-3.5c0-1 .099-1.405-.5-2 2.791-.3 5.5-1.366 5.5-6.04a4.567 4.567 0 0 0 -1.333 -3.21 4.192 4.192 0 00-.08-3.227s-1.05-.3-3.476 1.267a12.334 12.334 0 0 0 -6.222 0C6.462 2.723 5.413 3.023 5.413 3.023a4.192 4.192 0 0 0 -.08 3.227A4.566 4.566 0 004 9.486c0 4.64 2.709 5.68 5.5 6.014-.591.589-.56 1.183-.5 2V21" />
            </svg>
          </a>

          {/* Whatsapp */}
          <a
            href="https://wa.me/6282131211769"
            className="mx-2"
            aria-label="WA"
          >
            <svg
              class="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </a>

          {/* Email */}
        </div>
      </div>
    </div>
  </footer></div>
  )
}

export default footer