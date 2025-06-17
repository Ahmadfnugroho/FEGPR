import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function NavCard() {
  const [darkMode, setDarkMode] = useState("light");
  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  const toggleDarkMode = () => {
    setDarkMode(darkMode === "dark" ? "light" : "dark");
  };

  return (
    <>
      <div className="">
        <header className="w-full fixed inset-x-0 top-0 z-40 mx-auto  max-w-screen-2xl border border-gray-100 bg-white/80 dark:bg-gray-900/80 dark:border-gray-700 px-3 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl ">
          <div className="px-4">
            <div className="flex items-center justify-between">
              <div className="flex shrink-0">
                <Link to="/">
                  <span className="text-2xl font-bold text-primary">
                    Global{" "}
                  </span>
                  <span className="text-2xl font-bold text-dark dark:text-white">
                    Photo Rental
                  </span>
                </Link>
              </div>
              <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
                <a
                  aria-current="page"
                  className="inline-block rounded-lg px-2 py-1 text-lg font-medium text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:light dark:hover:text-dark hover:text-gray-900"
                  href="#"
                >
                  Kategori
                </a>
                <a
                  className="inline-block rounded-lg px-2 py-1 text-lg font-medium text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:light dark:hover:text-dark hover:text-gray-900"
                  href="#"
                >
                  Cara Sewa
                </a>

                <a
                  className="inline-block rounded-lg px-2 py-1 text-lg font-medium text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:light dark:hover:text-dark hover:text-gray-900"
                  href="#"
                >
                  Kontak
                </a>
              </div>
              <form action="" className="max-w-[480px] w-full px-4">
                <div className="relative">
                  <input
                    type="text"
                    name="q"
                    className="w-full border h-12 shadow p-4 rounded-full"
                    placeholder="Cari Produk/Kategori..."
                  />
                  <button type="submit">
                    <svg
                      className="text-gray-400 h-5 w-5 absolute top-3.5 right-3 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 56.966 56.966"
                      xmlSpace="preserve"
                    >
                      <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                    </svg>
                  </button>
                </div>
              </form>
              <div className="inline-flex items-center justify-center gap-3">
                <div className="flex items-center gap-5">
                  {/* cart */}
                  <a
                    href="#"
                    className="hidden lg:inline-block lg:ml-auto py-1.5 px-3 m-1 text-center bg-gray-100 border border-gray-300 rounded-md text-black dark:text-gray-300 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                      />
                    </svg>
                  </a>
                  {/* login */}
                  <a
                    className="hidden lg:inline-block lg:ml-auto py-1.5 px-3 m-1 text-center bg-gray-100 border border-gray-300 rounded-md text-black dark:text-gray-300 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    href="/login"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </a>
                  <div className="flex">
                    {/* Dark mode toggle button */}
                    <button
                      id="theme-toggle"
                      type="button"
                      className="lg:inline-block lg:ml-auto py-1.5 px-3 m-1 text-center bg-gray-100 border border-gray-300 rounded-md text-black dark:text-gray-300 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={toggleDarkMode}
                    >
                      {/* Dark Mode Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`${darkMode ? "hidden" : ""} size-6`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                        />
                      </svg>

                      {/* Light Mode Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`${darkMode ? "" : "hidden"} size-6`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
