import { useState, memo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { STORAGE_BASE_URL } from "../api/constants";
import FloatingCartButton from "./FloatingCartButton";

const NavCard = memo(function NavCard() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        navigate(`/browse-product?q=${encodeURIComponent(query)}`);
      }
    },
    [query, navigate],
  );

  const selectSuggestion = useCallback(
    (url: string) => {
      navigate(url);
      setQuery("");
    },
    [navigate],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
    },
    [],
  );

  const handleInputFocus = useCallback(() => {}, []);

  return (
    <header
      className="w-full fixed inset-x-0 top-0 z-40 mx-auto  
    bg-base-light-primary px-2 lg:px-3 py-1 lg:py-1 transition-all duration-300"
    >
      <div className="px-2 lg:px-4">
        <nav
          className="flex items-center justify-between gap-2 lg:gap-4"
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

              <span className="text-lg lg:text-2xl font-bold text-support-light-primary">
                Global
              </span>
              <span className="text-lg lg:text-2xl font-bold text-support-primary hidden sm:block">
                Photo Rental
              </span>
              <span className="text-lg lg:text-2xl font-bold text-support-primary sm:hidden">
                PR
              </span>
            </Link>
          </div>
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:gap-5">
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
              href="https://admin.globalphotorental.com/register"
              target="_blank"
              rel="noopener noreferrer"
            >
              Registrasi
            </a>
          </div>
          <div className="flex flex-1 justify-end items-center gap-2 lg:gap-4">
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-[320px] lg:max-w-[600px] relative"
              role="search"
            >
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  value={query}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  className="w-full border border-support-subtle h-10 lg:h-12 shadow-sm px-3 lg:px-4 py-2 rounded-full text-support-primary placeholder:text-support-tertiary focus:outline-none focus:ring-2 focus:ring-pop-primary/40 focus:border-pop-primary text-sm lg:text-base transition-all duration-300 focus:shadow-md bg-background-light-card"
                  placeholder="Cari..."
                  aria-label="Cari Produk atau Kategori"
                />
                <button
                  type="submit"
                  className="absolute top-2.5 lg:top-3.5 right-2 lg:right-3 text-support-tertiary transition-all duration-300 hover:text-pop-primary hover:scale-110"
                  aria-label="Cari"
                >
                  <svg
                    className="h-4 w-4 lg:h-5 lg:w-5 fill-current"
                    viewBox="0 0 56.966 56.966"
                  >
                    <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                  </svg>
                </button>
              </div>
            </form>
            <div className="flex-shrink-0">
              <FloatingCartButton />
            </div>
          </div>

          <div className="flex items-center flex-shrink-0">
            {/* Dark mode toggle button removed */}
          </div>
        </nav>
      </div>
    </header>
  );
});

export default NavCard;
