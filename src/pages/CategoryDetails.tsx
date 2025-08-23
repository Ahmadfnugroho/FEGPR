import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Category, Product } from "../types/type";
import { STORAGE_BASE_URL } from "../api/constants";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";
import NavCard from "../components/navCard";
import AnimatedPulseBorder from "../components/AnimatedPulseBorder";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import BottomNavigation from "../components/BottomNavigation";

export default function CategoryDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Fetch category info first
  useEffect(() => {
    if (!slug) return;

    axiosInstance
      .get(`/category/${slug}`)
      .then((response) => {
        setCategory(response.data.data);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [slug]);

  // Use products from category data directly with client-side pagination
  const fetchProducts = useCallback(
    async (p = 1, append = false) => {
      if (!category?.products) return;

      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        // Client-side pagination using category.products
        const startIndex = (p - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedProducts = category.products.slice(startIndex, endIndex);
        const totalItems = category.products.length;
        const calculatedTotalPages = Math.ceil(totalItems / pageSize);

        setTotalPages(calculatedTotalPages);
        setHasMore(p < calculatedTotalPages);

        if (append) {
          setProducts((prev) => [...prev, ...paginatedProducts]);
        } else {
          setProducts(paginatedProducts);
        }
        setPage(p);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Gagal memuat produk");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category, pageSize]
  );

  // Load products when category is loaded
  useEffect(() => {
    if (category) {
      fetchProducts(1, false);
    }
  }, [category, fetchProducts]);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    fetchProducts(page + 1, true);
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!category) {
    return (
      <>
        <NavCard></NavCard>
        <AnimatedPulseBorder isLoading={true}>
          <header className="flex flex-col w-full">
            <section className="relative flex h-[300px] sm:h-[350px] md:h-[400px] lg:h-[434px] parallax-container overflow-hidden">
              {/* Skeleton Hero Text */}
              <div
                className="relative flex flex-col w-full max-w-[90%] sm:max-w-[580px] md:max-w-[650px] h-fit rounded-[20px] sm:rounded-[25px] md:rounded-[30px] border border-[#E0DEF7] 
                             p-4 sm:p-6 md:p-8 lg:p-10 gap-3 sm:gap-4 md:gap-6 lg:gap-[30px] bg-white/95 backdrop-blur-sm
                             mt-20 lg:mt-[70px] mx-4 sm:mx-6 md:mx-8 lg:ml-[calc((100vw-1130px)/2)] lg:mx-0
                             z-20 shadow-lg"
              >
                <div className="h-12 sm:h-14 md:h-16 lg:h-20 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="space-y-2 md:space-y-3">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                </div>
              </div>
              {/* Skeleton Hero Image */}
              <div
                className="absolute inset-0 lg:right-0 lg:left-auto w-full lg:w-[calc(100vw-((100vw-1130px)/2)-350px)] 
                             h-full rounded-none lg:rounded-bl-[40px] overflow-hidden bg-gray-200 animate-pulse"
              ></div>
            </section>
          </header>
          <section className="flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[70px] mb-[120px]">
            <div className="flex items-center justify-between">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
            </div>
            <div className="grid grid-cols-3 gap-[30px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={`category-empty-${i}`} />
              ))}
            </div>
          </section>
        </AnimatedPulseBorder>
      </>
    );
  }

  return (
    <>
      <NavCard></NavCard>
      <AnimatedPulseBorder isLoading={loading}>
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
                         mt-20 md:mt-24 lg:mt-20 mx-4 sm:mx-6 md:mx-8 lg:ml-[calc((100vw-1130px)/2)] lg:mx-0
                         z-20 text-support-primary shadow-lg"
            >
              <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[50px] leading-tight sm:leading-tight md:leading-tight lg:leading-[60px] text-balance">
                Cari <span className="text-primary">{category.name}</span>{" "}
                Terbaik
                <span className="block">Disini!</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
                Alat yang tepat dapat memberikan dampak positif pada hasil foto
                dan video, meningkatkan kualitas karya, serta mendukung
                perkembangan keterampilan fotografi atau videografi Anda.
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
                src={`${STORAGE_BASE_URL}/${category.photo}`}
                className="w-full h-full object-cover scale-110"
                alt="hero background"
                loading="eager"
              />
            </div>
          </section>
        </header>
        <section
          id="Fresh-Space"
          className="flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[70px] mb-[120px] scroll-fade-in"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[32px] leading-[48px] text-nowrap scroll-fade-in">
              Browse Product
            </h2>
            <p className="text-gray-600 text-sm">
              {products.length}{" "}
              {hasMore ? "of " + (category?.products_count || "many") : ""}{" "}
              produk
            </p>
          </div>

          {products.length === 0 ? (
            <div className="grid grid-cols-3 gap-[30px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={`product-empty-${i}`} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-[30px] stagger-fade-in">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="stagger-item"
                    data-index={index}
                  >
                    <Link to={`/product/${product.slug}`}>
                      <ProductCard product={product}></ProductCard>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Load More Section */}
              {loadingMore && (
                <div className="grid grid-cols-3 gap-[30px] mt-[30px]">
                  {Array.from({ length: Math.min(6, pageSize) }).map((_, i) => (
                    <ProductCardSkeleton key={`skeleton-${i}`} />
                  ))}
                </div>
              )}

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    {loadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Loading...
                      </>
                    ) : (
                      "Load More Products"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </AnimatedPulseBorder>
      <BottomNavigation></BottomNavigation>
    </>
  );
}
