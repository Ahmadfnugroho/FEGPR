import NavCard from "../components/navCard";

export default function CaraSewa() {
  return (
    <>
      <NavCard />

      {/* Heading Section dengan gradient Tailwind */}
      <div className="relative overflow-hidden pt-24 pb-24">
        {/* Gradient Background */}
        <div className="absolute inset-0 flex justify-center">
          <div className="w-[120%] h-[2000%] blur-[60px] opacity-80 bg-gradient-radial from-primary/80 to-transparent" />
        </div>
        {/* Judul */}
        <h1 className="relative text-center text-3xl md:text-6xl font-bold pt-10 text-dark dark:text-light">
          Cara Sewa
        </h1>
      </div>

      {/* Konten */}
      <div className="max-w-3xl mx-auto px-4 py-10 text-dark dark:text-light">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
          Prosedur Sewa Alat GLOBAL PHOTO RENTAL untuk Pertama Kali Sewa
        </h1>
        <ol className="list-decimal pl-5 space-y-3 mb-8">
          <li>
            Tanyakan ketersediaan alat pada tanggal dan jam rencana sewa kepada
            admin WA
          </li>
          <li>
            Apabila alat ready, penyewa mengisi form data diri dengan lengkap
            dan benar
          </li>
          <li>
            Mengirimkan 3 jenis foto identitas diri yang mencantumkan alamat
            berupa:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>KTP (Wajib)</li>
              <li>KK</li>
              <li>SIM</li>
              <li>NPWP</li>
              <li>BPKB</li>
              <li>Passport</li>
            </ul>
          </li>
          <li>
            Follow akun Instagram global.photorental (mengirimkan bukti
            screenshot)
          </li>
          <li>
            Tunggu proses verifikasi data diri sampai Admin mengirimkan total
            pembayaran
          </li>
          <li>Melakukan pembayaran awal (DP) sebesar 50% dari total sewa</li>
        </ol>

        <h2 className="text-xl font-semibold mb-2 text-primary">
          Ketentuan Delivery dan Pick Up
        </h2>
        <ol className="list-decimal pl-5 space-y-3 mb-8">
          <li>
            Konfirmasi ke Admin apakah bisa dikirim atau di pick up oleh driver
            Global Photo Rental
          </li>
          <li>Apabila bisa, penyewa mengirimkan alamat antar dan/atau ambil</li>
          <li>
            Pengiriman dan pengambilan alat oleh driver Global Photo Rental
            dikenakan biaya
          </li>
          <li>
            Besaran biaya tergantung jarak tempuh dan lokasi (konfirmasi biaya
            ke Admin WA)
          </li>
          <li>
            Setelah setuju maka pengiriman dan/atau pengambilan dilakukan pada
            tanggal dan jam sesuai form yang telah diisi
          </li>
        </ol>

        <h2 className="text-xl font-semibold mb-2 text-primary">
          Ketentuan dan Tata Tertib Sewa Alat Global Photo Rental
        </h2>
        <ol className="list-decimal pl-5 space-y-3 mb-8">
          <li>
            Selama belum ada pembayaran DP, alat belum bisa dijadwalkan/lock,
            jadi sewaktu waktu status alat bisa berubah/full
          </li>
          <li>
            Alat yang sudah dilakukan bayar DP/dilock tidak dapat dibatalkan
            atau diganti namun dapat dilakukan penambahan alat apabila ready.
            Pembatalan akan menyebabkan DP yang sudah dibayarkan hangus/tidak
            dapat dikembalikan
          </li>
          <li>
            Penyerahan dan Pengembalian barang sesuai dengan waktu yang diisi
            pada form sewa dan hanya dilakukan pada saat jam operasional yaitu
            07:00-22:00
          </li>
          <li>
            Penyewa meninggalkan KTP (asli) dan satu identitas lain (asli) yang
            mencantumkan alamat pada saat pengambilan alat atau pada saat alat
            diantar
          </li>
          <li>
            Penyewa alat wajib memeriksa dan mencoba alat yg akan disewa
            terlebih dahulu
          </li>
          <li>Bersedia difoto saat penyerahan alat sewa</li>
          <li>
            Pembayaran pelunasan sewa dilakukan LUNAS diawal atau pada saat alat
            diserahkan Global Photo Rental kepada penyewa
          </li>
          <li>
            Keterlambatan pengembalian alat lebih dari 1 jam dikenakan denda
            30%, lebih dari 3 jam akan dihitung sewa satu hari.
          </li>
          <li>
            Kerusakan atau Kehilangan pada saat penyewaan menjadi tanggung jawab
            penyewa
          </li>
          <li>
            Segala tindak pidana yang terjadi (penipuan, penggelapan,
            Penggadaian dll) akan ditindak oleh tim khusus kami dan dilaporkan
            kepada pihak berwajib untuk ditindaklanjuti sesuai hukum yang
            berlaku
          </li>
          <li>
            Dengan menandatangani surat “Tanda Terima” alat pada saat
            pengambilan atau pengantaran, berarti penyewa telah menyepakati
            syarat dan ketentuan.
          </li>
          <li className="font-bold text-red-600 dark:text-red-400">
            DILARANG KERAS melepas Stiker Segel Global Photo Rental yang
            ditempel di alat.
          </li>
        </ol>
      </div>
    </>
  );
}
