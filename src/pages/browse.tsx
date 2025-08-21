import { Link } from "react-router-dom";

import BrowseBrandWrapper from "../wrappers/BrowseBrandWrapper";
import BrowseCategoryWrapper from "../wrappers/BrowseCategoryWrapper";
import BrowseProductWrapper from "../wrappers/BrowseProductWrapper";
import NavCard from "../components/navCard";
import FooterSection from "../components/FooterSection";
export default function Browse() {
  return (
    <>
      <div className="md:hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:bg-dark">
        <main className="max-w-[640px] mx-auto min-h-screen flex flex-col relative has-[#Bottom-nav]:pb-[144px] pt-[60px]">
          <NavCard></NavCard>
          {/* Welcome Section */}
          <section className="px-6 mt-6 mb-8 scroll-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h1 className="font-bold text-2xl leading-7 text-gray-800 dark:text-white mb-2">
                Selamat Datang! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-6">
                Temukan peralatan kamera terbaik untuk kebutuhan fotografi Anda
              </p>
            </div>
          </section>

          <section
            id="Categories"
            className="flex flex-col gap-4 px-6 scroll-fade-in"
            data-delay="100"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl leading-6 text-gray-800 dark:text-white">
                📂 Kategori
              </h2>
              <Link
                to="/browse-product"
                className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Lihat Semua →
              </Link>
            </div>
            <BrowseCategoryWrapper></BrowseCategoryWrapper>
          </section>

          <section
            id="New"
            className="flex flex-col gap-4 mt-8 px-6 scroll-fade-in"
            data-delay="200"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl leading-6 text-gray-800 dark:text-white">
                🏢 Brand Kami
              </h2>
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Terpercaya
              </span>
            </div>
            <BrowseBrandWrapper></BrowseBrandWrapper>
          </section>
          {/* Fresh-Space Mobile Section - Super Compact */}
          <section
            id="Fresh-Space-Mobile"
            className="flex flex-col gap-3 mt-6 px-4 mb-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm mx-2 rounded-2xl p-4 shadow-md border border-gray-100 dark:border-gray-700 scroll-fade-in"
            data-delay="300"
          >
            <div className="text-center">
              <h2 className="font-bold text-lg leading-5 text-gray-800 dark:text-white mb-1">
                🌟 Produk Unggulan
              </h2>
              <p className="text-blue-600 dark:text-blue-400 text-sm">
                Direkomendasikan untuk Anda
              </p>
            </div>
            <BrowseProductWrapper />
          </section>
          <div
            id="Bottom-nav"
            className="fixed bottom-0 max-w-[640px] w-full mx-auto border-t border-gray-200 dark:border-gray-700 overflow-hidden z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md"
          >
            <ul className="flex items-center justify-evenly py-3 px-2 relative z-10">
              {/* Home - Sesuai dengan logo di navbar web */}
              <li>
                <Link
                  to="/"
                  className="flex flex-col items-center p-2 rounded-xl transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center gap-1 transition-all duration-300 text-blue-600 dark:text-blue-400">
                    <div className="w-7 h-7 flex shrink-0 p-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
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
                    <p className="font-bold text-xs text-blue-600 dark:text-blue-400">
                      Home
                    </p>
                  </div>
                </Link>
              </li>
              {/* Kategori - Sesuai dengan navbar web */}
              <li>
                <Link
                  to="/browse-product"
                  className="flex flex-col items-center p-2 rounded-xl transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center gap-1 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
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
                  <div className="flex flex-col items-center text-center gap-1 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
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
                  <div className="flex flex-col items-center text-center gap-1 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
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
        </main>
      </div>
      {/* TAMPILAN WEB */}
      <div className="hidden md:block bg-gray-10 border-gray-200 dark:bg-base-dark-primary">
        <NavCard></NavCard>
        <header className="flex flex-col w-full">
          <section
            id="Hero-Banner"
            className="relative flex h-[720px] -mb-[93px] parallax-container overflow-hidden"
          >
            <div
              id="Hero-Text"
              className="relative flex flex-col w-full max-w-[650px] h-fit rounded-[30px] border border-[#E0DEF7] dark:border-gray-700 p-10 gap-[30px] bg-white dark:bg-gray-800 mt-[70px] ml-[calc((100%-1130px)/2)] z-10 scroll-fade-in"
            >
              <div className="flex items-center w-fit rounded-full py-2 px-4 gap-[10px] bg-[#000929] dark:bg-primary">
                <img
                  src="/assets/images/icons/crown-white.svg"
                  className="w-5 h-5"
                />
                <span className="font-semibold text-white">
                  Sewa Kamera Terbaik di Jakarta
                </span>
              </div>
              <h1 className="font-extrabold text-[50px] leading-[60px] text-pop-light-primary dark:text-support-light-border-subtle">
                All Perfect Shots.
                <br />
                Capture the Spots.
              </h1>
              <p className="text-lg leading-8 text-[#000929] dark:text-support-light-border-subtle">
                Kamera yang tepat dapat memberikan dampak besar pada hasil karya
                Anda, meningkatkan kualitas foto, dan membantu karir fotografi
                tumbuh lebih baik.
              </p>
              <div className="flex items-center gap-5">
                <Link
                  to="/browse-product"
                  className="flex items-center rounded-full p-[20px_26px] gap-3 bg-primary"
                >
                  <img
                    src="/assets/images/icons/slider-horizontal-white.svg"
                    className="w-[30px] h-[30px]"
                    alt="icon"
                  />
                  <span className="font-bold text-xl leading-[30px] text-[#F7F7FD]">
                    Telusuri
                  </span>
                </Link>
              </div>
            </div>
            <div
              id="Hero-Image"
              className="absolute right-0 w-[calc(100%-((100%-1130px)/2)-305px)] h-[620px] rounded-bl-[40px] overflow-hidden parallax-bg scroll-fade-in"
              data-parallax-speed="-0.2"
              data-delay="200"
            >
              <img
                src="/assets/hero-bg.png"
                className="w-full h-full object-cover scale-110"
                alt="hero background"
                style={{ transform: "scaleX(-1)" }}
              />
            </div>
          </section>
          <BrowseBrandWrapper></BrowseBrandWrapper>
        </header>
        <BrowseCategoryWrapper></BrowseCategoryWrapper>
        <section
          id="Benefits"
          className="flex items-center justify-center w-[1015px] mx-auto gap-[100px] mt-[100px] scroll-fade-in"
          data-delay="100"
        >
          <h2 className="font-bold text-[32px] leading-[48px] text-nowrap text-dark dark:text-light scroll-fade-in">
            The Best Solution <br />
            For Your Camera Needs
          </h2>
          <div
            className="grid grid-cols-2 gap-[30px] stagger-fade-in"
            data-staggerdelay="100"
          >
            <div
              className="flex items-center gap-4 stagger-item"
              data-index="0"
            >
              <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white dark:bg-dark overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  className="w-[50px] h-[50px]"
                  stroke="black"
                >
                  <path
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    className="text-primary dark:text-primary-dark"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-[5px]">
                <p className="font-bold text-lg leading-[27px] text-dark dark:text-light">
                  Stok Realtime
                </p>
                <p className="text-sm leading-[24px] text-dark dark:text-light">
                  Tidak perlu antri, masukkan saja tanggal dan cek stok alat
                  secara realtime.
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-4 stagger-item"
              data-index="1"
            >
              <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white dark:bg-dark overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  className="w-[50px] h-[50px]"
                  stroke="black"
                >
                  <path
                    d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    className="text-secondary dark:text-secondary-dark"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-[5px]">
                <p className="font-bold text-lg leading-[27px] text-dark dark:text-light">
                  Mudah dan Fleksibel
                </p>
                <p className="text-sm leading-[24px] text-dark dark:text-light">
                  Identitas luar daerah? Tidak masalah. Sewa mendadak tanpa
                  terdaftar? Bisa. Sewa tanpa jaminan? Tentu saja!
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-4 stagger-item"
              data-index="2"
            >
              <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white dark:bg-dark overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  className="w-[50px] h-[50px]"
                  stroke="black"
                >
                  <path
                    d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
                    className="text-accent dark:text-accent-dark"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-[5px]">
                <p className="font-bold text-lg leading-[27px] text-dark dark:text-light">
                  Cepat & Praktis
                </p>
                <p className="text-sm leading-[24px] text-dark dark:text-light">
                  Booking online 24 jam, ambil & kembalikan alat 24 jam.
                  Pembayaran Mudah. Notifikasi status order otomatis via
                  WhatsApp."
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-4 stagger-item"
              data-index="3"
            >
              <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white dark:bg-dark overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  className="w-[50px] h-[50px]"
                  stroke="black"
                >
                  <path
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                    className="text-muted dark:text-muted-dark"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-[5px]">
                <p className="font-bold text-lg leading-[27px] text-dark dark:text-light">
                  Berpengalaman & Handal
                </p>
                <p className="text-sm leading-[24px] text-dark dark:text-light">
                  Dengan pengalaman belasan tahun di industri foto dan video,
                  kami tidak hanya menyewakan, tetapi juga menjadi rekan yang
                  memahami kebutuhan Anda.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          className="mt-[50px] mb-[100px] scroll-fade-in"
          data-delay="200"
        >
          <div className="scroll-fade-in" data-delay="400">
            <BrowseProductWrapper></BrowseProductWrapper>
          </div>
        </section>
      </div>
      {/* FOOTER SECTION */}
      <FooterSection />
    </>
  );
}
