import React from "react";

export default function FooterSection() {
  return (
    <section className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 md:gap-8">
        {/* Brand Info */}
        <div className="flex-1 min-w-[250px]">
          <h6 className="uppercase font-bold text-white md:text-lg tracking-wide">
            GLOBAL.PHOTORENTAL
          </h6>
          <div className="w-12 md:w-16 h-1 bg-white my-2 md:my-3 rounded" />
          <p className="text-xs md:text-sm leading-relaxed">
            Global Photo Rental adalah layanan jasa rental alat fotografi dan
            videografi berlokasi di Jakarta Pusat. Telah berdiri sejak 2019.
            <br />
            Hubungi kami untuk kebutuhan fotografi dan videografi Anda.
          </p>
        </div>
        {/* Social Media & Contact */}
        <div className="flex-1 min-w-[250px]">
          <h6 className="uppercase font-bold text-white md:text-lg tracking-wide mb-2 md:mb-3">
            Sosial Media
          </h6>
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <a
              href="https://wa.me/6281212349564?text=Halo,%20saya%20mau%20sewa%20kamera"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:text-primary transition-colors"
            >
              {/* WhatsApp Icon */}
              <svg
                className="w-6 h-6 md:w-8 md:h-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.455 4.436-9.89 9.893-9.89 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.896 6.991c-.003 5.456-4.438 9.891-9.893 9.891m8.413-18.304A11.815 11.815 0 0 0 12.05 0C5.495 0 .06 5.435.058 12.086c0 2.13.557 4.21 1.617 6.033L0 24l6.064-1.606a11.888 11.888 0 0 0 5.983 1.527h.005c6.554 0 11.89-5.435 11.893-12.086a11.82 11.82 0 0 0-3.48-8.591" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/global.photorental?igsh=MW9rYTZidnVncGIxbA%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-primary transition-colors"
            >
              {/* Instagram Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 md:w-10 md:h-10"
                viewBox="0 0 50 50"
                fill="white"
              >
                <path d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z"></path>
              </svg>{" "}
            </a>
            <a
              href="https://www.tiktok.com/@globalphotorental?_t=ZS-90jHa1qkTlC&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-primary transition-colors"
            >
              {/* Twitter Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
              </svg>
            </a>
          </div>
          <h6 className="uppercase font-bold mt-3 md:mt-4 mb-2 text-white md:text-lg tracking-wide">
            Contact
          </h6>
          <div className="space-y-1 md:space-y-2">
            <a
              href="https://wa.me/6281212349564?text=Halo,%20saya%20mau%20sewa%20kamera"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-2 text-xs md:text-sm"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.455 4.436-9.89 9.893-9.89 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.896 6.991c-.003 5.456-4.438 9.891-9.893 9.891" />
              </svg>
              0812-1234-9564
            </a>
            <a
              href="mailto:global.photorental@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-2 text-xs md:text-sm"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8.99l8 6.99 8-6.99V18z" />
              </svg>
              global.photorental@gmail.com
            </a>
          </div>
        </div>
        {/* Maps & Address */}
        <div className="flex-1 min-w-[250px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15866.871702864491!2d106.8439828!3d-6.1685137!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f59ab7791adb%3A0xbd23ce14a107aee2!2sGlobal%20Photo%20Rental!5e0!3m2!1sid!2sid!4v1711423981245!5m2!1sid!2sid"
            width="100%"
            height="120"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Global Photo Rental Map"
            className="rounded-lg shadow-md md:h-[150px]"
          />
          <a
            href="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15866.871702864491!2d106.8439828!3d-6.1685137!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f59ab7791adb%3A0xbd23ce14a107aee2!2sGlobal%20Photo%20Rental!5e0!3m2!1sid!2sid!4v1711423981245!5m2!1sid!2sid"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-xs md:text-sm hover:text-primary transition-colors leading-relaxed"
          >
            Jalan Kepu Selatan No 27C RT 001 RW 003 Kel. Kemayoran, Kec.
            kemayoran, Jakarta Pusat, DKI Jakarta 10620
            <br />
            Buka Setiap Hari <br />
            Jam Operasional : 07:00-22:00 WIB
          </a>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-6 md:mt-8">
        &copy; {new Date().getFullYear()} GLOBAL.PHOTORENTAL. All rights
        reserved.
      </div>
      <div className="text-center text-xs text-navy-blue-600">
        Mau website seperti ini? <br />
        <a
          href="https://wa.me/628111709596"
          target="_blank"
          rel="noopener noreferrer"
          className="text-navy-blue-600 hover:underline"
        >
          Klik di sini
        </a>
      </div>
    </section>
  );
}
