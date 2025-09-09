import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bundling } from "../types/type";
import axiosInstance from "../api/axiosInstance";
import BundlingCard from "../components/BundlingCard";
import BundlingSearch from "../components/BundlingSearch";
import NavCard from "../components/navCard";
import BundlingCardSkeleton from "../components/BundlingCardSkeleton";
import ProductSkeleton from "../components/ProductSkeleton";
import { MainLayout } from "../components/Layout";
import {
  isBundlingAvailable,
  getBundlingAvailabilityText,
  sortBundlingByAvailability,
  filterBundlingByAvailability,
  debugAvailability
} from "../utils/availabilityUtils";

export default function BundlingList() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  
  const [bundlings, setBundlings] = useState<Bundling[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(Number(params.get("page") || 1));
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>(params.get("q") || "");
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'availability'>('name');
  const [availableOnly, setAvailableOnly] = useState(false);
  const pageSize = 10;

  // Fetch bundlings with pagination
  const fetchBundlings = useCallback(
    async (p = 1, append = false, query = "") => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const apiParams: any = {
          page: p,
          limit: pageSize,
        };
        
        if (query) {
          apiParams.q = query;
        }

        const response = await axiosInstance.get("/bundlings", {
          params: apiParams,
        });

        const data = response.data.data || [];
        const meta = response.data.meta || {};

        setTotalPages(meta.last_page ?? 1);
        setHasMore(p < (meta.last_page ?? 1));

        if (append) {
          setBundlings((prev) => [...prev, ...data]);
        } else {
          setBundlings(data);
        }
        setPage(p);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Gagal memuat bundling");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [pageSize, searchQuery]
  );

  // Sync URL params with state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const qParam = urlParams.get("q") || "";
    setSearchQuery(qParam);
    setPage(Number(urlParams.get("page") || 1));
  }, [location.search]);

  useEffect(() => {
    fetchBundlings(1, false, searchQuery);
  }, [searchQuery]);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    fetchBundlings(page + 1, true, searchQuery);
  };

  if (loading) {
    return (
      <MainLayout>
        <header className="flex flex-col w-full">
          <section
            id="Hero-Banner"
            className="relative flex h-[300px] sm:h-[350px] md:h-[400px] lg:h-[434px] parallax-container overflow-hidden"
          >
            {/* Skeleton Hero Text */}
            <div
              id="Hero-Text"
              className="relative flex flex-col w-full max-w-[90%] sm:max-w-[580px] md:max-w-[650px] h-fit rounded-[20px] sm:rounded-[25px] md:rounded-[30px] border border-[#E0DEF7] 
                         p-4 sm:p-6 md:p-8 lg:p-10 gap-3 sm:gap-4 md:gap-6 lg:gap-[30px] bg-white/95 backdrop-blur-sm
                         mt-20 mx-4 sm:mx-6 md:mx-8 lg:ml-[calc((100vw-1130px)/2)] lg:mx-0
                         z-20 text-support-primary shadow-lg"
            >
              <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[50px] leading-tight sm:leading-tight md:leading-tight lg:leading-[60px] text-balance">
                Paket <span className="text-primary">Bundling</span> Terbaik
                <span className="block">Disini!</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
                Hemat lebih banyak dengan paket bundling kami! Dapatkan
                kombinasi peralatan fotografi dan videografi terbaik dengan
                harga yang lebih ekonomis dibandingkan menyewa secara terpisah.
              </p>
            </div>

            {/* Skeleton Hero Image */}
            <div
              id="Hero-Image"
              className="absolute inset-0 lg:right-0 lg:left-auto w-full lg:w-[calc(100vw-((100vw-1130px)/2)-350px)] 
                         h-full rounded-none lg:rounded-bl-[40px] overflow-hidden parallax-bg
                         before:absolute before:inset-0 before:bg-black/20 before:z-10 lg:before:bg-transparent"
              data-parallax-speed="-0.15"
            >
              <img
                src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop&crop=center&auto=format&q=80"
                className="w-full h-full object-cover scale-110"
                alt="hero background"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/800x600/cccccc/666666?text=Bundling";
                }}
              />
            </div>
          </section>
        </header>
        <section className="flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[70px] mb-[120px]">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[32px] leading-[48px] text-nowrap">
              Paket Bundling Kami
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-[30px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <BundlingCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        </section>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <header className="flex flex-col w-full">
        <section
          id="Hero-Banner"
          className="relative flex h-[300px] sm:h-[350px] md:h-[400px] lg:h-[434px] parallax-container overflow-hidden"
        >
          {/* Hero Text */}
          <div
            id="Hero-Text"
            className="relative flex flex-col w-full max-w-[90%] sm:max-w-[580px] md:max-w-[650px] h-fit rounded-[20px] sm:rounded-[25px] md:rounded-[30px] border border-[#E0DEF7] 
                       p-4 sm:p-6 md:p-8 lg:p-10 gap-3 sm:gap-4 md:gap-6 lg:gap-[30px] bg-white/95 backdrop-blur-sm
                        mt-20 lg:mt-[70px] mx-4 sm:mx-6 md:mx-8 lg:ml-[calc((100vw-1130px)/2)] lg:mx-0
                       z-20 text-support-primary shadow-lg"
          >
            <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[50px] leading-tight sm:leading-tight md:leading-tight lg:leading-[60px] text-balance">
              Paket <span className="text-primary">Bundling</span> Terbaik
              <span className="block">Disini!</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
              Hemat lebih banyak dengan paket bundling kami! Dapatkan kombinasi
              peralatan fotografi dan videografi terbaik dengan harga yang lebih
              ekonomis dibandingkan menyewa secara terpisah.
            </p>
          </div>

          {/* Hero Image */}
          <div
            id="Hero-Image"
            className="absolute inset-0 lg:right-0 lg:left-auto w-full lg:w-[calc(100vw-((100vw-1130px)/2)-350px)] 
                       h-full rounded-none lg:rounded-bl-[40px] overflow-hidden parallax-bg
                       before:absolute before:inset-0 before:bg-black/20 before:z-10 lg:before:bg-transparent"
            data-parallax-speed="-0.15"
          >
            <img
              src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop&crop=center&auto=format&q=80"
              className="w-full h-full object-cover scale-110"
              alt="hero background"
              loading="eager"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/800x600/cccccc/666666?text=Bundling";
              }}
            />
          </div>
        </section>
      </header>
      <section
        id="Fresh-Space"
        className="flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[70px] mb-[120px] scroll-fade-in"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <h2 className="font-bold text-[32px] leading-[48px] text-nowrap scroll-fade-in">
            Paket Bundling Kami
          </h2>
          <div className="flex flex-col lg:items-end gap-2">
            <BundlingSearch
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={(q) => {
                const ps = new URLSearchParams(location.search);
                if (q) ps.set("q", q); else ps.delete("q");
                ps.set("page", "1");
                navigate({ pathname: location.pathname, search: ps.toString() });
              }}
              resultsCount={bundlings.length}
              placeholder="Cari bundling..."
              className="lg:w-96"
            />
          </div>
        </div>
        
        {searchQuery && (
          <div className="mb-6 text-gray-600 text-sm">
            {bundlings.length === 0 
              ? `Tidak ada hasil untuk "${searchQuery}"` 
              : `Menampilkan ${bundlings.length} hasil${hasMore ? ' dari banyak' : ''} untuk "${searchQuery}"`
            }
          </div>
        )}

        {bundlings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Belum ada paket bundling tersedia.
            </p>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Tampilkan yang tersedia saja
              </label>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="name">Nama</option>
                  <option value="price">Harga</option>
                  <option value="availability">Ketersediaan</option>
                </select>
              </div>
            </div>

            {(() => {
              // Apply filters and sorting
              let visible = availableOnly ? filterBundlingByAvailability(bundlings, true) : bundlings;
              if (sortBy === 'availability') {
                visible = sortBundlingByAvailability(visible);
              }

              return (
                <div className="grid grid-cols-3 gap-[30px] stagger-fade-in">
                  {visible.map((bundling, index) => (
                    <div
                      key={bundling.id}
                      className="stagger-item"
                      data-index={index}
                    >
                      <Link to={`/bundling/${bundling.slug}`}>
                        <BundlingCard bundling={bundling}></BundlingCard>
                      </Link>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Load More Section */}
            {loadingMore && (
              <div className="grid grid-cols-3 gap-[30px] mt-[30px]">
                {Array.from({ length: Math.min(6, pageSize) }).map((_, i) => (
                  <BundlingCardSkeleton key={`skeleton-${i}`} />
                ))}
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-text-light-primary hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    "Load More Bundling"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </MainLayout>
  );
}
