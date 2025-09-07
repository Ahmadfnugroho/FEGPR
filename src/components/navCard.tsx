import { Link } from "react-router-dom";
import { STORAGE_BASE_URL } from "../api/constants";
import AdvancedSearchBar from "./AdvancedSearchBar";

export default function NavCard() {

  return (
    <header
      className="w-full fixed inset-x-0 top-0 z-40 mx-auto max-w-screen-2xl border border-support-subtle 
    bg-base-light-primary/70 px-2 md:px-3 py-2 md:py-3 shadow-lg backdrop-blur-lg md:top-6 md:rounded-3xl transition-all duration-300"
    >
      <div className="px-2 md:px-4">
        <nav
          className="flex items-center justify-between gap-2 md:gap-4"
          aria-label="Main navigation"
        >
          <div className="flex shrink-0">
            <Link
              to="/"
              className="flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            >
              <img
                src={`${STORAGE_BASE_URL}/LOGO-GPR.png`}
                alt="Global Photo Rental Logo"
                className="h-12 w-auto"
              />

              <span className="text-lg md:text-2xl font-bold text-support-light-primary">
                Global
              </span>
              <span className="text-lg md:text-2xl font-bold text-support-primary hidden sm:block">
                Photo Rental
              </span>
              <span className="text-lg md:text-2xl font-bold text-support-primary sm:hidden">
                PR
              </span>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
            <Link
              className="inline-block rounded-lg px-3 py-2 text-lg font-medium text-support-primary transition-all duration-300 hover:bg-base-light-primary hover:text-pop-primary hover:shadow-md hover:translate-y-[-2px] focus-visible:ring-2 focus-visible:ring-pop-primary"
              to="/browse-product"
            >
              Kategori
            </Link>
            <Link
              className="inline-block rounded-lg px-3 py-2 text-lg font-medium text-support-primary transition-all duration-300 hover:bg-base-light-primary hover:text-pop-primary hover:shadow-md hover:translate-y-[-2px] focus-visible:ring-2 focus-visible:ring-pop-primary"
              to="/cara-sewa"
            >
              Cara Sewa
            </Link>
            <a
              className="inline-block rounded-lg px-3 py-2 text-lg font-medium text-support-primary transition-all duration-300 hover:bg-base-light-primary hover:text-pop-primary hover:shadow-md hover:translate-y-[-2px] focus-visible:ring-2 focus-visible:ring-pop-primary"
              href="http://bit.ly/formglobalphotorental"
              target="_blank"
              rel="noopener noreferrer"
            >
              Registrasi
            </a>
          </div>
          <AdvancedSearchBar 
            placeholder="Cari produk, bundling..."
            maxSuggestions={8}
          />
          <div className="flex items-center flex-shrink-0">
            {/* Dark mode toggle button removed */}
          </div>
        </nav>
      </div>
    </header>
  );
}
