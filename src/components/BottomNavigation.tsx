import { Link } from "react-router-dom";

export default function BottomNavigation() {
  return (
    <div
      id="Bottom-nav"
      className="fixed bottom-0 max-w-[640px] w-full mx-auto border-t border-gray-200 overflow-hidden z-10 bg-white/95 backdrop-blur-md md:hidden"
    >
      <ul className="flex items-center justify-evenly py-3 px-2 relative z-10">
        {/* Home - Sesuai dengan logo di navbar web */}
        <li>
          <Link
            to="/"
            className="flex flex-col items-center p-2 rounded-xl transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center gap-1 transition-all duration-300 text-blue-600">
              <div className="w-7 h-7 flex shrink-0 p-1 bg-blue-50 rounded-lg">
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 22V12H15V22"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="font-bold text-xs text-blue-600">Home</p>
            </div>
          </Link>
        </li>
        {/* Kategori - Sesuai dengan navbar web */}
        <li>
          <Link
            to="/browse-product"
            className="flex flex-col items-center p-2 rounded-xl transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center gap-1 transition-all duration-300 text-gray-500 hover:text-gray-700">
              <div className="w-7 h-7 flex shrink-0 p-1 rounded-lg">
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6H20L18 14H6L4 6Z"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 6L2 2H1"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="7"
                    cy="20"
                    r="1"
                    stroke="currentColor"
                    strokeWidth={2}
                  />
                  <circle
                    cx="17"
                    cy="20"
                    r="1"
                    stroke="currentColor"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <p className="font-semibold text-xs">Kategori</p>
            </div>
          </Link>
        </li>
        {/* Cara Sewa - Sesuai dengan navbar web */}
        <li>
          <Link
            to="/cara-sewa"
            className="flex flex-col items-center p-2 rounded-xl transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center gap-1 transition-all duration-300 text-gray-500 hover:text-gray-700">
              <div className="w-7 h-7 flex shrink-0 p-1 rounded-lg">
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.663 17H7.5C6.11929 17 5 15.8807 5 14.5S6.11929 12 7.5 12H9.663M14.337 17H16.5C17.8807 17 19 15.8807 19 14.5S17.8807 12 16.5 12H14.337M8 14.5H16"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="font-semibold text-xs">Cara Sewa</p>
            </div>
          </Link>
        </li>
        {/* Registrasi - Sesuai dengan navbar web (external link) */}
        <li>
          <a
            href="http://bit.ly/formglobalphotorental"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-2 rounded-xl transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center gap-1 transition-all duration-300 text-gray-500 hover:text-gray-700">
              <div className="w-7 h-7 flex shrink-0 p-1 rounded-lg">
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="8.5"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth={2}
                  />
                  <path
                    d="M20 8V14"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 11H17"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="font-semibold text-xs">Daftar</p>
            </div>
          </a>
        </li>
      </ul>
    </div>
  );
}
