import React from "react";

export default function FooterSection() {
  return (
    <footer className="w-full py-6 md:py-8 px-4 bg-black/90 text-white mt-8 md:mt-10">
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 md:gap-8">
          {/* Brand Info */}
          <div className="flex-1 min-w-[250px]">
            <h6 className="uppercase font-bold text-base-dark-primary dark:text-base-light-primary md:text-lg tracking-wide">
              GLOBAL.PHOTORENTAL
            </h6>
            <div className="w-12 md:w-16 h-1 bg-primary my-2 md:my-3 rounded" />
            <p className="text-xs md:text-sm leading-relaxed">
              Global Photo Rental adalah layanan jasa rental alat fotografi dan
              videografi berlokasi di Jakarta Pusat. Established since 2019.
              <br />
              Feel free to contact us
            </p>
          </div>
          {/* Social Media & Contact */}
          <div className="flex-1 min-w-[250px]">
            <h6 className="uppercase font-bold text-base-dark-primary dark:text-base-light-primary md:text-lg tracking-wide mb-2 md:mb-3">
              Sosial Media
            </h6>
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <a
                href="https://wa.me/message/RKVS5KQ7NXZFJ1"
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
                  className="w-6 h-6 md:w-8 md:h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.069 1.646.069 4.85s-.011 3.584-.069 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.011-4.85-.069c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.783 2.295 7.149 2.233 8.415 2.175 8.795 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.659.36 3.678 1.342 2.697 2.323 2.465 3.435 2.407 4.716 2.349 5.996 2.337 6.405 2.337 12c0 5.595.012 6.004.07 7.284.058 1.281.29 2.393 1.271 3.374.981.981 2.093 1.213 3.374 1.271 1.28.058 1.689.07 7.284.07s6.004-.012 7.284-.07c1.281-.058 2.393-.29 3.374-1.271.981-.981 1.213-2.093 1.271-3.374.058-1.28.07-1.689.07-7.284s-.012-6.004-.07-7.284c-.058-1.281-.29-2.393-1.271-3.374C19.393.36 18.281.128 17 .07 15.72.012 15.311 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-primary transition-colors"
              >
                {/* Twitter Icon */}
                <svg
                  className="w-6 h-6 md:w-8 md:h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z" />
                </svg>
              </a>
            </div>
            <h6 className="uppercase font-bold mt-3 md:mt-4 mb-2 text-base-dark-primary dark:text-base-light-primary md:text-lg tracking-wide">
              Contact
            </h6>
            <div className="space-y-1 md:space-y-2">
              <a
                href="https://wa.me/message/RKVS5KQ7NXZFJ1"
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
              Jalan Kepu Selatan No. 11A, Kemayoran, Jakarta Pusat <br />
              Buka Setiap Hari <br />
              Operational Hours : 07:00-22:00 WIB
            </a>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-6 md:mt-8">
          &copy; {new Date().getFullYear()} GLOBAL.PHOTORENTAL. All rights
          reserved.
        </div>
      </section>
    </footer>
  );
}
