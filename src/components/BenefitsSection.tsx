export default function BenefitsSection() {
  return (
    <section
      id="Benefits"
      className="hidden md:flex items-center justify-center w-[1015px] mx-auto gap-[100px] mt-8 scroll-fade-in"
      data-delay="100"
    >
      <h2 className="font-bold text-[32px] leading-[48px] text-nowrap text-dark scroll-fade-in">
        The Best Solution <br />
        For Your Camera Needs
      </h2>
      <div
        className="grid grid-cols-2 gap-[30px] stagger-fade-in"
        data-staggerdelay="100"
      >
        <div className="flex items-center gap-4 stagger-item" data-index="0">
          <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden">
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
                className="text-primary"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-[5px]">
            <p className="font-bold text-lg leading-[27px] text-dark">
              Stok Realtime
            </p>
            <p className="text-sm leading-[24px] text-dark">
              Tidak perlu antri, masukkan saja tanggal dan cek stok alat secara
              realtime.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 stagger-item" data-index="1">
          <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden">
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
                className="text-secondary"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-[5px]">
            <p className="font-bold text-lg leading-[27px] text-dark">
              Mudah dan Fleksibel
            </p>
            <p className="text-sm leading-[24px] text-dark">
              Identitas luar daerah? Tidak masalah. Sewa mendadak tanpa
              terdaftar? Bisa. Sewa tanpa jaminan? Tentu saja!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 stagger-item" data-index="2">
          <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden">
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
                className="text-accent"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-[5px]">
            <p className="font-bold text-lg leading-[27px] text-dark">
              Cepat & Praktis
            </p>
            <p className="text-sm leading-[24px] text-dark">
              Booking online 24 jam, ambil & kembalikan alat 24 jam. Pembayaran
              Mudah. Notifikasi status order otomatis via WhatsApp."
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 stagger-item" data-index="3">
          <div className="flex items-center justify-center shrink-0 w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden">
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
                className="text-muted"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-[5px]">
            <p className="font-bold text-lg leading-[27px] text-dark">
              Berpengalaman & Handal
            </p>
            <p className="text-sm leading-[24px] text-dark">
              Dengan pengalaman belasan tahun di industri foto dan video, kami
              tidak hanya menyewakan, tetapi juga menjadi rekan yang memahami
              kebutuhan Anda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
