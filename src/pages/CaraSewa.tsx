import NavCard from "../components/navCard";
import FooterSection from "../components/FooterSection";
import BottomNavigation from "../components/BottomNavigation";

export default function CaraSewa() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 md:bg-white">
      <NavCard />

      {/* Main Container - Responsive Layout */}
      <main className="max-w-[640px] mx-auto min-h-screen flex flex-col relative has-[#Bottom-nav]:pb-[144px] pt-[60px] md:max-w-7xl md:pt-0 md:pb-0">
        {/* Header Section */}
        <div className="hidden md:flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6 px-4 sm:px-6 lg:px-8"></div>

        {/* Mobile Header */}
        <div className="md:hidden px-6 py-4 bg-white/90 backdrop-blur-sm mx-2 my-4 rounded-2xl shadow-md border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            📋 Cara Sewa Alat
          </h1>
          <p className="text-gray-600 text-center mt-2 text-sm">
            Panduan lengkap proses penyewaan
          </p>
        </div>

        {/* Content Section */}
        <div className="py-6 md:py-12 px-6 md:px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="hidden md:block bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 mb-12 border border-blue-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Panduan Lengkap Penyewaan Alat
                </h2>
                <p className="text-gray-600 text-lg">
                  Ikuti langkah-langkah berikut untuk proses penyewaan yang
                  mudah dan aman
                </p>
              </div>
            </div>

            {/* Mobile Intro Card */}
            <div className="md:hidden bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-md border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Panduan Lengkap Penyewaan Alat
                </h2>
                <p className="text-gray-600 text-lg">
                  Ikuti langkah-langkah berikut untuk proses penyewaan yang
                  mudah dan aman
                </p>
              </div>
            </div>
            {/* Prosedur Sewa */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-indigo-600">1</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Prosedur Sewa untuk Pertama Kali
                </h2>
              </div>

              <div className="grid gap-4 md:gap-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm md:text-base">
                      Tanyakan ketersediaan alat pada tanggal dan jam rencana
                      sewa kepada admin WhatsApp
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm md:text-base">
                      Apabila alat tersedia, penyewa mengisi form data diri
                      dengan lengkap dan benar
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm md:text-base mb-3">
                      Mengirimkan 3 jenis foto identitas diri yang mencantumkan
                      alamat berupa:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          KTP (Wajib)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          Kartu Keluarga
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">SIM</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">NPWP</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">BPKB</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">Passport</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                    4
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm md:text-base">
                      Follow akun Instagram @global.photorental dan kirimkan
                      bukti screenshot
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                    5
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm md:text-base">
                      Tunggu proses verifikasi data diri sampai Admin
                      mengirimkan total pembayaran
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                    6
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm md:text-base">
                      <span className="font-semibold text-indigo-600">
                        Melakukan pembayaran awal (DP) sebesar 50% dari total
                        sewa
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ketentuan Delivery */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Ketentuan Delivery dan Pick Up
                </h2>
              </div>

              <div className="grid gap-4 md:gap-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm md:text-base">
                      Konfirmasi ke Admin apakah bisa dikirim atau di pick up
                      oleh driver Global Photo Rental
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm md:text-base">
                      Apabila bisa, penyewa mengirimkan alamat antar dan/atau
                      ambil
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm md:text-base">
                      <span className="font-semibold text-amber-600">
                        Pengiriman dan pengambilan alat dikenakan biaya
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                    4
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm md:text-base">
                      Besaran biaya tergantung jarak tempuh dan lokasi
                      (konfirmasi biaya ke Admin WA)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                    5
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm md:text-base">
                      Setelah setuju maka pengiriman dan/atau pengambilan
                      dilakukan pada tanggal dan jam sesuai form yang telah
                      diisi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ketentuan & Tata Tertib */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-amber-600">3</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Ketentuan dan Tata Tertib Sewa Alat Global Photo Rental
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 bg-gray-400 rounded-full" />
                  <p className="text-gray-700 text-sm md:text-base">
                    Selama belum ada pembayaran DP, alat belum bisa
                    dijadwalkan/lock, jadi sewaktu waktu status alat bisa
                    berubah/full
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 bg-gray-400 rounded-full" />
                  <p className="text-gray-700 text-sm md:text-base">
                    Alat yang sudah dilakukan bayar DP/dilock tidak dapat
                    dibatalkan atau diganti namun dapat dilakukan penambahan
                    alat apabila ready. Pembatalan akan menyebabkan DP yang
                    sudah dibayarkan hangus/tidak dapat dikembalikan
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 bg-gray-400 rounded-full" />
                  <p className="text-gray-700 text-sm md:text-base">
                    Penyerahan dan Pengembalian barang sesuai dengan waktu yang
                    diisi pada form sewa dan hanya dilakukan pada saat jam
                    operasional yaitu 07:00-22:00
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 bg-gray-400 rounded-full" />
                  <p className="text-gray-700 text-sm md:text-base">
                    Penyewa meninggalkan KTP (asli) dan satu identitas lain
                    (asli) yang mencantumkan alamat pada saat pengambilan alat
                    atau pada saat alat diantar
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 bg-gray-400 rounded-full" />
                  <p className="text-gray-700 text-sm md:text-base">
                    Penyewa alat wajib memeriksa dan mencoba alat yg akan disewa
                    terlebih dahulu
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 bg-gray-400 rounded-full" />
                  <p className="text-gray-700 text-sm md:text-base">
                    Bersedia difoto saat penyerahan alat sewa
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 bg-gray-400 rounded-full" />
                  <p className="text-gray-700 text-sm md:text-base">
                    Pembayaran pelunasan sewa dilakukan LUNAS diawal atau pada
                    saat alat diserahkan Global Photo Rental kepada penyewa
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 bg-gray-400 rounded-full" />
                  <p className="text-gray-700 text-sm md:text-base">
                    Keterlambatan pengembalian alat lebih dari 1 jam dikenakan
                    denda 30%, lebih dari 3 jam akan dihitung sewa satu hari.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 bg-gray-400 rounded-full" />
                  <p className="text-gray-700 text-sm md:text-base">
                    Kerusakan atau Kehilangan pada saat penyewaan menjadi
                    tanggung jawab penyewa
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 bg-gray-400 rounded-full" />
                  <p className="text-gray-700 text-sm md:text-base">
                    Segala tindak pidana yang terjadi (penipuan, penggelapan,
                    penggadaian dll) akan ditindak oleh tim khusus kami dan
                    dilaporkan kepada pihak berwajib untuk ditindaklanjuti
                    sesuai hukum yang berlaku
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 bg-gray-400 rounded-full" />
                  <p className="text-gray-700 text-sm md:text-base">
                    Dengan menandatangani surat “Tanda Terima” alat pada saat
                    pengambilan atau pengantaran, berarti penyewa telah
                    menyepakati syarat dan ketentuan.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 mt-2 bg-red-500 rounded-full" />
                  <p className="text-red-600 font-semibold text-sm md:text-base">
                    DILARANG KERAS melepas Stiker Segel Global Photo Rental yang
                    ditempel di alat.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact CTA Section */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 md:p-8 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.455 4.436-9.89 9.893-9.89 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.896 6.991c-.003 5.456-4.438 9.891-9.893 9.891" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Masih Ada Pertanyaan?
                </h3>
                <p className="text-green-100 mb-6 text-lg">
                  Tim customer service kami siap membantu Anda 24/7
                </p>
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <a
                    href="https://wa.me/message/RKVS5KQ7NXZFJ1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group"
                  >
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.455 4.436-9.89 9.893-9.89 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.896 6.991c-.003 5.456-4.438 9.891-9.893 9.891" />
                    </svg>
                    <span>Chat WhatsApp</span>
                  </a>
                  <a
                    href="tel:081212349564"
                    className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 group"
                  >
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>Telepon Langsung</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNavigation />

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
