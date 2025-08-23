import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <header className="hidden md:flex flex-col w-full">
      <section
        id="Hero-Banner"
        className="relative flex h-[720px] -mb-[93px] parallax-container overflow-hidden"
      >
        <div
          id="Hero-Text"
          className="relative flex flex-col w-full max-w-[650px] h-fit rounded-[30px] border border-[#E0DEF7] p-10 gap-[30px] bg-white mt-[100px] ml-[calc((100%-1130px)/2)] z-10 scroll-fade-in"
        >
          <div className="flex items-center w-fit rounded-full py-2 px-4 gap-[10px] bg-text-light-primary">
            <img
              src="/assets/images/icons/crown-white.svg"
              className="w-5 h-5"
            />
            <span className="font-semibold text-white">
              Sewa Kamera Terbaik di Jakarta
            </span>
          </div>
          <h1 className="font-extrabold text-[50px] leading-[60px] text-light-primary">
            All Perfect Shots.
            <br />
            Capture the Spots.
          </h1>
          <p className="text-lg leading-8 text-[#000929]">
            Kamera yang tepat dapat memberikan dampak besar pada hasil karya
            Anda, meningkatkan kualitas foto, dan membantu karir fotografi
            tumbuh lebih baik.
          </p>
          <div className="flex items-center gap-5">
            <Link
              to="/browse-product"
              className="flex items-center rounded-full p-[20px_26px] gap-3 bg-text-light-primary"
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
    </header>
  );
}
