import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import CategoryCard from "../components/CategoryCard.";
import { useEffect, useState, useCallback } from "react";
import { Category } from "../types/type";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";
import CategoryCardSkeleton from "../components/CategoryCardSkeleton";
import "../styles/CategorySwiper.css";

export default function BrowseCategoryWrapper() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(() => {
    const controller = new AbortController();
    axiosInstance
      .get("/categories", {
        signal: controller.signal,
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          console.warn("Invalid categories data received:", response.data);
          setCategories([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          setError(error.message);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const abortFetch = fetchCategories();
    return () => {
      abortFetch();
    };
  }, [fetchCategories]);

  // Bundling category
  const bundlingCategory = {
    id: 9999,
    name: "Bundling",
    slug: "bundling",
    photo:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop&crop=center&auto=format&q=80",
    products_count: 0,
    products: [],
  };

  const safeCategories = Array.isArray(categories) ? categories : [];
  const allCategories = [bundlingCategory, ...safeCategories];

  if (loading) {
    return (
      <>
        {/* MOBILE SKELETON */}
        <section className="md:hidden category-swiper-mobile">
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={8}
              slidesPerView="auto"
              navigation={{
                nextEl: '.swiper-button-next-custom-mobile',
                prevEl: '.swiper-button-prev-custom-mobile',
              }}
              pagination={{ 
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 3
              }}
              className="category-swiper-compact"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SwiperSlide key={`skeleton-mobile-${i}`} className="!w-fit">
                  <CategoryCardSkeleton />
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom Navigation Buttons for Mobile */}
            <div className="swiper-button-prev-custom-mobile absolute top-1/2 -translate-y-1/2 left-1 z-10 w-7 h-7 bg-white/80 hover:bg-white/90 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 group hover:scale-110">
              <svg className="w-3 h-3 text-text-light-primary group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="swiper-button-next-custom-mobile absolute top-1/2 -translate-y-1/2 right-1 z-10 w-7 h-7 bg-white/80 hover:bg-white/90 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 group hover:scale-110">
              <svg className="w-3 h-3 text-text-light-primary group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </section>

        {/* WEB SKELETON */}
        <section className="hidden md:block flex-col gap-[30px]">
          <div className="w-full max-w-[1130px] mx-auto flex items-center justify-between">
            <h2 className="font-bold text-[32px] leading-[48px] text-nowrap text-primary mt-10 mb-10">
              Cek Kategori Favorit Kami
            </h2>
            <div className="font-bold text-primary">Selengkapnya</div>
          </div>
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={12}
              slidesPerView="auto"
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{ 
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 5
              }}
              className="category-swiper-compact"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <SwiperSlide key={`skeleton-web-${i}`} className="!w-fit">
                  <CategoryCardSkeleton />
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom Navigation Buttons */}
            <div className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-2 z-10 w-8 h-8 bg-white/80 hover:bg-white/90 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 group hover:scale-110">
              <svg className="w-4 h-4 text-text-light-primary group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-2 z-10 w-8 h-8 bg-white/80 hover:bg-white/90 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 group hover:scale-110">
              <svg className="w-4 h-4 text-text-light-primary group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      {/* MOBILE - Compact Swiper with touchscreen support */}
      <section className="md:hidden scroll-fade-in category-swiper-mobile">
        <div className="relative px-2">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={8}
            slidesPerView="auto"
            navigation={{
              nextEl: '.swiper-button-next-custom-mobile',
              prevEl: '.swiper-button-prev-custom-mobile',
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
              dynamicMainBullets: 3
            }}
            touchRatio={1.2}
            simulateTouch={true}
            grabCursor={true}
            className="category-swiper-compact"
          >
            {allCategories.map((category) => (
              <SwiperSlide key={category.id} className="!w-fit">
                <Link
                  to={
                    category.slug === "bundling"
                      ? `/bundlings`
                      : `/category/${category.slug}`
                  }
                >
                  <CategoryCard category={category} />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Navigation Buttons for Mobile - Smaller and more compact */}
          <div className="swiper-button-prev-custom-mobile absolute top-1/2 -translate-y-1/2 left-1 z-10 w-7 h-7 bg-white/80 hover:bg-white/90 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 group hover:scale-110">
            <svg className="w-3 h-3 text-text-light-primary group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="swiper-button-next-custom-mobile absolute top-1/2 -translate-y-1/2 right-1 z-10 w-7 h-7 bg-white/80 hover:bg-white/90 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 group hover:scale-110">
            <svg className="w-3 h-3 text-text-light-primary group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </section>

      {/* WEB - Compact Swiper with touchscreen support */}
      <section
        id="Cities"
        className="hidden md:block mt-24 mx-14 scroll-fade-in"
      >
        <div className="w-full max-w-[1130px] mx-auto flex items-center justify-between">
          <h2 className="font-bold text-[32px] leading-[48px] text-nowrap text-primary mt-10 mb-10">
            Cek Kategori Favorit Kami
          </h2>
          <Link to="/browse-product" className="font-bold text-primary">
            Selengkapnya
          </Link>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={12}
            slidesPerView="auto"
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
              dynamicMainBullets: 5
            }}
            touchRatio={1.2}
            simulateTouch={true}
            grabCursor={true}
            className="category-swiper-compact"
          >
            {allCategories.map((category) => (
              <SwiperSlide key={category.id} className="!w-fit">
                <Link
                  to={
                    category.slug === "bundling"
                      ? `/bundlings`
                      : `/category/${category.slug}`
                  }
                >
                  <CategoryCard category={category} />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Navigation Buttons for Web */}
          <div className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-2 z-10 w-8 h-8 bg-white/80 hover:bg-white/90 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 group hover:scale-110">
            <svg className="w-4 h-4 text-text-light-primary group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-2 z-10 w-8 h-8 bg-white/80 hover:bg-white/90 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 group hover:scale-110">
            <svg className="w-4 h-4 text-text-light-primary group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}
