export default function BenefitsSection() {
  return (
    <section
      id="Benefits"
      className="hidden md:flex items-center justify-center lg:w-10/12 mx-auto my-10 lg:gap-[100px] scroll-fade-in"
      data-delay="100"
    >
      <h2 className="font-bold text-[32px] leading-[48px] text-nowrap text-dark scroll-fade-in">
        The Best Solution <br />
        For Your Camera Needs
      </h2>
      <div
        className="grid grid-cols-2 items-stretch  content-stretch gap-10 stagger-fade-in"
        data-staggerdelay="100"
      >
        <div className="flex items-center stagger-item" data-index="0">
          <div className="flex items-center justify-center shrink-0 lg:w-[70px] lg:h-[70px] rounded-[23px] bg-white overflow-hidden">
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
          <div className="flex flex-col">
            <p className="font-bold text-sm lg:text-lg text-dark">
              Alat kondisi terbaik dan terawat
            </p>
            <p className="text-xs lg:text-base leading-[24px] text-dark">
              Alat yang disewakan sangat terawat dengan kualitas terbaik.
              Dibersihkan setiap hari secara profesional
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 stagger-item" data-index="1">
          <div className="flex items-center justify-center shrink-0 lg:w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden">
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
            <p className="font-bold text-sm lg:text-lg leading-[27px] text-dark">
              Mudah dan Fleksibel
            </p>
            <p className="text-xs lg:text-base leading-[24px] text-dark">
              Identitas luar daerah? Tidak masalah. Sewa mendadak tanpa daftar
              member? Bisa
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 stagger-item" data-index="2">
          <div className="flex items-center justify-center shrink-0 lg:w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden">
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
            <p className="font-bold text-sm lg:text-lg leading-[27px] text-dark">
              Cepat & Praktis
            </p>
            <p className="text-xs lg:text-base leading-[24px] text-dark">
              Booking online, ambil & kembalikan alat. Pembayaran Mudah, dan
              respon cepat admin
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 stagger-item" data-index="3">
          <div className="flex items-center justify-center shrink-0 lg:w-[70px] h-[70px] rounded-[23px] bg-white overflow-hidden">
            <svg
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              strokeWidth="6"
              className="w-[50px] h-[50px]"
              stroke="black"
              viewBox="0 0 92.35 122.88"
            >
              <path d="M46.18,0a9.26,9.26,0,0,1,5.61,1.76C54,3.16,56.45,5.91,59.5,7.65c4.28,2.45,12.22-.93,16.29,5.11,2.37,3.52,2.48,6.28,2.66,9a15.8,15.8,0,0,0,3.72,9.63c5,6.6,6,11,3.45,15.57-1.75,3.11-5.44,4.85-6.29,6.82-1.82,4.2.19,7.37-2.3,12.27a13.05,13.05,0,0,1-7.93,6.78c-3,1-6-.43-8.39.58C56.5,75.19,53.39,79.3,50,80.34a13,13,0,0,1-7.73,0c-3.35-1-6.45-5.15-10.66-6.92-2.4-1-5.4.39-8.39-.58a13,13,0,0,1-7.94-6.78c-2.49-4.9-.48-8.07-2.3-12.27-.85-2-4.54-3.71-6.29-6.82C4.16,42.39,5.2,38,10.19,31.4a15.92,15.92,0,0,0,3.72-9.63c.17-2.73.28-5.49,2.66-9,4.06-6,12-2.66,16.29-5.11,3-1.74,5.51-4.49,7.7-5.88A9.29,9.29,0,0,1,46.18,0ZM89,113.07,77.41,111l-5.73,10.25c-4.16,5.15-6.8-3.31-8-6.26L52.57,94c2.57-.89,5.67-3.47,8.85-6.35,6.35.13,12.27-1,16.62-6.51l12.82,24.75L92,108.22c.87,3.09.41,5.13-3,4.85Zm-85.57,0L15,111l5.73,10.25c4.15,5.15,6.79-3.31,8-6.26L39.78,94c-2.57-.89-5.66-3.47-8.85-6.35-6.35.13-12.27-1-16.62-6.51L1.5,105.85.38,108.22c-.87,3.09-.41,5.13,3,4.85Zm36.13-76.8,4.72,4.45,9.49-9.64c.93-.95,1.52-1.71,2.68-.52l3.76,3.84c1.23,1.22,1.17,1.94,0,3.08L46.38,51c-2.45,2.41-2,2.56-4.51.09l-8.68-8.64a1.09,1.09,0,0,1,.1-1.69l4.36-4.52c.66-.68,1.19-.64,1.87,0Zm6.54-19.34A24.16,24.16,0,1,1,21.91,41.09,24.16,24.16,0,0,1,46.06,16.93Z" />
            </svg>
          </div>
          <div className="flex flex-col gap-[5px]">
            <p className="font-bold text-sm lg:text-lg leading-[27px] text-dark">
              Berpengalaman & Handal
            </p>
            <p className="text-xs lg:text-base leading-[24px] text-dark">
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
