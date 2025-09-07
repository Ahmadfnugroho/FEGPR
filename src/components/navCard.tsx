import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { STORAGE_BASE_URL } from "../api/constants";
import axiosInstance from "../api/axiosInstance";

export default function NavCard() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ambil saran
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await axiosInstance.get("/search-suggestions", {
          params: { q: query },
        });
        setSuggestions(res.data.suggestions);
      } catch (err) {
        console.error(err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // Klik di luar → tutup dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/browse-product?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (url: string) => {
    navigate(url);
    setQuery("");
    setShowSuggestions(false);
  };

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
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-[320px] md:max-w-[480px] px-2 md:px-4 relative"
            role="search"
          >
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                name="q"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.length > 0) setShowSuggestions(true);
                  else setShowSuggestions(false);
                }}
                onFocus={() => query.length > 0 && setShowSuggestions(true)}
                className="w-full border border-support-subtle h-10 md:h-12 shadow-sm px-3 md:px-4 py-2 rounded-full text-support-primary placeholder:text-support-tertiary focus:outline-none focus:ring-2 focus:ring-pop-primary/40 focus:border-pop-primary text-sm md:text-base transition-all duration-300 focus:shadow-md bg-background-light-card"
                placeholder="Cari..."
                aria-label="Cari Produk atau Kategori"
              />
              <button
                type="submit"
                className="absolute top-2.5 md:top-3.5 right-2 md:right-3 text-support-tertiary transition-all duration-300 hover:text-pop-primary hover:scale-110"
                aria-label="Cari"
              >
                <svg
                  className="h-4 w-4 md:h-5 md:w-5 fill-current"
                  viewBox="0 0 56.966 56.966"
                >
                  <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                </svg>
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-1 bg-base-secondary border border-support-subtle rounded-lg shadow-lg z-50 max-h-48 md:max-h-60 overflow-y-auto"
              >
                {suggestions.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestion(item.url)}
                    className="w-full text-left px-3 md:px-4 py-2 hover:bg-base-tertiary flex items-center gap-2 md:gap-3 text-xs md:text-sm transition-all duration-300 hover:pl-4 md:hover:pl-5 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {item.thumbnail && (
                      <img
                        src={`${STORAGE_BASE_URL}/${item.thumbnail}`}
                        alt=""
                        className="w-6 h-6 md:w-8 md:h-8 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <span className="text-support-primary truncate">
                      {item.display}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </form>
          <div className="flex items-center flex-shrink-0">
            {/* Dark mode toggle button removed */}
          </div>
        </nav>
      </div>
    </header>
  );
}
