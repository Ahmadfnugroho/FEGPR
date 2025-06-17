import BrowseBrandWrapper from "../wrappers/BrowseBrandWrapper";
import BrowseCategoryWrapper from "../wrappers/BrowseCategoryWrapper";
import BrowseeProductWrapper from "../wrappers/BrowseProductWrapper";
import NavCard from "../components/navCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import BrandCard from "../components/BrandCard";
export default function Browse() {
  return (
    <>
      <div className="md:hidden bg-white border-gray-200 dark:bg-dark">
        <main className="max-w-[640px] mx-auto min-h-screen flex flex-col relative has-[#Bottom-nav]:pb-[144px] pt-[50px]">
          <NavCard></NavCard>
          <section
            id="Categories"
            className="flex flex-col gap-[10px] mt-[30px] px-5"
          >
            <h2 className="font-semibold text-lg leading-5 text-dark dark:text-light">
              Kategori
            </h2>
            <BrowseCategoryWrapper></BrowseCategoryWrapper>
          </section>

          <section id="New" className="flex flex-col gap-[10px] mt-[30px]">
            <h2 className="font-semibold text-lg leading-[27px] px-5 text-dark dark:text-light">
              Brand Kami
            </h2>
            <BrowseBrandWrapper></BrowseBrandWrapper>
          </section>
          <section
            id="Recommendation"
            className="flex flex-col gap-[10px] mt-[30px] px-5"
          >
            <h2 className="font-semibold text-lg leading-[27px]">
              You Might Like
            </h2>
            <div className="flex flex-col gap-5">
              <a href="details.html" className="card">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 flex shrink-0 rounded-2xl overflow-hidden bg-[#F6F6F6] items-center">
                    <div className="w-full h-[50px] flex shrink-0 justify-center">
                      <img
                        src="/assets/images/thumbnails/iphone15pro-digitalmat-gallery-3-202309-Photoroom 1.png"
                        className="h-full w-full object-contain"
                        alt="thumbnail"
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-semibold">iPhone 15 Pro</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm leading-[21px] text-[#6E6E70]">
                        Rp 180.000/day
                      </p>
                      <div className="flex items-center w-fit gap-[2px]">
                        <div className="w-4 h-4 flex shrink-0">
                          <img
                            src="/assets/images/icons/Star 1.svg"
                            alt="star"
                          />
                        </div>
                        <p className="text-sm leading-[21px]">
                          <span className="font-semibold">4/5</span>{" "}
                          <span className="text-[#6E6E70]">(777)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
              <a href="details.html" className="card">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 flex shrink-0 rounded-2xl overflow-hidden bg-[#F6F6F6] items-center">
                    <div className="w-full h-[50px] flex shrink-0 justify-center">
                      <img
                        src="/assets/images/thumbnails/color_back_green__buxxfjccqjzm_large_2x-Photoroom 1.png"
                        className="h-full w-full object-contain"
                        alt="thumbnail"
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-semibold">iMac Powerless</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm leading-[21px] text-[#6E6E70]">
                        Rp 5.800.000/day
                      </p>
                      <div className="flex items-center w-fit gap-[2px]">
                        <div className="w-4 h-4 flex shrink-0">
                          <img
                            src="/assets/images/icons/Star 1.svg"
                            alt="star"
                          />
                        </div>
                        <p className="text-sm leading-[21px]">
                          <span className="font-semibold">4/5</span>{" "}
                          <span className="text-[#6E6E70]">(123)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
              <a href="details.html" className="card">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 flex shrink-0 rounded-2xl overflow-hidden bg-[#F6F6F6] items-center">
                    <div className="w-full h-[50px] flex shrink-0 justify-center">
                      <img
                        src="/assets/images/thumbnails/airpods-max-select-skyblue-202011-Photoroom 1.png"
                        className="h-full w-full object-contain"
                        alt="thumbnail"
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-semibold">AirPod Deluxe</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm leading-[21px] text-[#6E6E70]">
                        Rp 5.800.000/day
                      </p>
                      <div className="flex items-center w-fit gap-[2px]">
                        <div className="w-4 h-4 flex shrink-0">
                          <img
                            src="/assets/images/icons/Star 1.svg"
                            alt="star"
                          />
                        </div>
                        <p className="text-sm leading-[21px]">
                          <span className="font-semibold">4/5</span>{" "}
                          <span className="text-[#6E6E70]">(45)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
              <a href="details.html" className="card">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 flex shrink-0 rounded-2xl overflow-hidden bg-[#F6F6F6] items-center">
                    <div className="w-full h-[50px] flex shrink-0 justify-center">
                      <img
                        src="/assets/images/thumbnails/mba13-m2-digitalmat-gallery-1-202402-Photoroom 2.png"
                        className="h-full w-full object-contain"
                        alt="thumbnail"
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <p className="font-semibold">Macbook Pro 13”</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm leading-[21px] text-[#6E6E70]">
                        Rp 124.000.000/day
                      </p>
                      <div className="flex items-center w-fit gap-[2px]">
                        <div className="w-4 h-4 flex shrink-0">
                          <img
                            src="/assets/images/icons/Star 1.svg"
                            alt="star"
                          />
                        </div>
                        <p className="text-sm leading-[21px]">
                          <span className="font-semibold">4/5</span>{" "}
                          <span className="text-[#6E6E70]">(66)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </section>
          <div
            id="Bottom-nav"
            className="fixed bottom-0 max-w-[640px] w-full mx-auto border-t border-[#F1F1F1] overflow-hidden z-10"
          >
            <div className="bg-white/50 backdrop-blur-sm absolute w-full h-full" />
            <ul className="flex items-center gap-3 justify-evenly p-5 relative z-10">
              <li>
                <a href="index.html">
                  <div className="group flex flex-col items-center text-center gap-2 transition-all duration-300 hover:text-black">
                    <div className="w-6 h-6 flex shrink-0">
                      <svg
                        width={25}
                        height={24}
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.325 18.98H7.92495C7.50495 18.98 7.03495 18.65 6.89495 18.25L2.75495 6.66999C2.16496 5.00999 2.85496 4.49999 4.27496 5.51999L8.17495 8.30999C8.82495 8.75999 9.56495 8.52999 9.84495 7.79999L11.605 3.10999C12.165 1.60999 13.095 1.60999 13.655 3.10999L15.415 7.79999C15.695 8.52999 16.435 8.75999 17.075 8.30999L20.735 5.69999C22.295 4.57999 23.045 5.14999 22.405 6.95999L18.365 18.27C18.215 18.65 17.745 18.98 17.325 18.98Z"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.125 22H18.125"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10.125 14H15.125"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="font-semibold text-sm leading-[21px] text-[]">
                      Browse
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a href="check-booking.html">
                  <div className="group flex flex-col items-center text-center gap-2 transition-all duration-300 hover:text-black text-[#9D9DAD]">
                    <div className="w-6 h-6 flex shrink-0">
                      <svg
                        width={25}
                        height={24}
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.875 2V5"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.875 2V5"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.875 13H15.875"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.875 17H12.875"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.875 3.5C20.205 3.68 21.875 4.95 21.875 9.65V15.83C21.875 19.95 20.875 22.01 15.875 22.01H9.875C4.875 22.01 3.875 19.95 3.875 15.83V9.65C3.875 4.95 5.545 3.69 8.875 3.5H16.875Z"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="font-semibold text-sm leading-[21px] text-[]">
                      Orders
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a href="">
                  <div className="group flex flex-col items-center text-center gap-2 transition-all duration-300 hover:text-black text-[#9D9DAD]">
                    <div className="w-6 h-6 flex shrink-0">
                      <svg
                        width={25}
                        height={24}
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.625 12.5C19.625 11.12 20.745 10 22.125 10V9C22.125 5 21.125 4 17.125 4H7.125C3.125 4 2.125 5 2.125 9V9.5C3.505 9.5 4.625 10.62 4.625 12C4.625 13.38 3.505 14.5 2.125 14.5V15C2.125 19 3.125 20 7.125 20H17.125C21.125 20 22.125 19 22.125 15C20.745 15 19.625 13.88 19.625 12.5Z"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.125 14.75L15.125 8.75"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.1195 14.75H15.1285"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.11951 9.25H9.12849"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="font-semibold text-sm leading-[21px] text-[]">
                      Promos
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a href="">
                  <div className="group flex flex-col items-center text-center gap-2 transition-all duration-300 hover:text-black text-[#9D9DAD]">
                    <div className="w-6 h-6 flex shrink-0">
                      <svg
                        width={25}
                        height={24}
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.375 18.86H17.615C16.815 18.86 16.055 19.17 15.495 19.73L13.785 21.42C13.005 22.19 11.735 22.19 10.955 21.42L9.245 19.73C8.685 19.17 7.915 18.86 7.125 18.86H6.375C4.715 18.86 3.375 17.53 3.375 15.89V4.97998C3.375 3.33998 4.715 2.01001 6.375 2.01001H18.375C20.035 2.01001 21.375 3.33998 21.375 4.97998V15.89C21.375 17.52 20.035 18.86 18.375 18.86Z"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.375 9.16003C7.375 8.23003 8.135 7.46997 9.065 7.46997C9.995 7.46997 10.755 8.23003 10.755 9.16003C10.755 11.04 8.085 11.24 7.495 13.03C7.375 13.4 7.685 13.77 8.075 13.77H10.755"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.415 13.76V8.05003C16.415 7.79003 16.245 7.55997 15.995 7.48997C15.745 7.41997 15.475 7.51997 15.335 7.73997C14.615 8.89997 13.835 10.22 13.155 11.38C13.045 11.57 13.045 11.82 13.155 12.01C13.265 12.2 13.475 12.3199 13.705 12.3199H17.375"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="font-semibold text-sm leading-[21px] text-[]">
                      Contact
                    </p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </main>
      </div>
      {/* TAMPILAN WEB */}
      <div className="hidden md:block bg-gray-10 border-gray-200 dark:bg-dark">
        <NavCard></NavCard>
        <header className="flex flex-col w-full">
          <section
            id="Hero-Banner"
            className="relative flex h-[720px] -mb-[93px]"
          >
            <div
              id="Hero-Text"
              className="relative flex flex-col w-full max-w-[650px] h-fit rounded-[30px] border border-[#E0DEF7] dark:border-gray-700 p-10 gap-[30px] bg-white dark:bg-gray-800 mt-[70px] ml-[calc((100%-1130px)/2)] z-10"
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
              <h1 className="font-extrabold text-[50px] leading-[60px] text-dark dark:text-light">
                All Perfect Shots.
                <br />
                Capture the Spots.
              </h1>
              <p className="text-lg leading-8 text-[#000929] dark:text-light">
                Kamera yang tepat dapat memberikan dampak besar pada hasil karya
                Anda, meningkatkan kualitas foto, dan membantu karir fotografi
                tumbuh lebih baik.
              </p>
              <div className="flex items-center gap-5">
                <a
                  href="#"
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
                </a>
              </div>
            </div>
            <div
              id="Hero-Image"
              className="absolute right-0 w-[calc(100%-((100%-1130px)/2)-305px)] h-[720px] rounded-bl-[40px] overflow-hidden"
            >
              <img
                src="/assets/hero-bg.png"
                className="w-full h-full object-cover"
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
          className="flex items-center justify-center w-[1015px] mx-auto gap-[100px] mt-[100px]"
        >
          <h2 className="font-bold text-[32px] leading-[48px] text-nowrap text-dark dark:text-light">
            The Best Solution <br />
            For Your Camera Needs
          </h2>
          <div className="grid grid-cols-2 gap-[30px]">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white dark:bg-gray-900 overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  className="w-[50px] h-[50px] stroke:dark dark:stroke-light"
                >
                  <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
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
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px]  bg-white dark:bg-gray-900  overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  className="w-[50px] h-[50px] stroke:dark dark:stroke-light"
                >
                  <path d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
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
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px]  bg-white dark:bg-gray-900  overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  className="w-[50px] h-[50px] stroke:dark dark:stroke-lights"
                >
                  <path d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
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
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px]  bg-white dark:bg-gray-900  overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  className="w-[50px] h-[50px] stroke:dark dark:stroke-light"
                >
                  <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
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
        <BrowseeProductWrapper></BrowseeProductWrapper>
      </div>
    </>
  );
}
