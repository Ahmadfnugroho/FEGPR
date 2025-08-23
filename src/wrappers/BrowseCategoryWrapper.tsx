import { Swiper } from "swiper/react";
import { SwiperSlide } from "swiper/react";
import CategoryCard from "../components/CategoryCard.";
import { useEffect, useState, useCallback } from "react";
import { Category } from "../types/type";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";
import { Link } from "react-router-dom";
import CategoryCardSkeleton from "../components/CategoryCardSkeleton";
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
        setCategories(response.data.data);
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

  if (loading) {
    return (
      <>
        {/* MOBILE SKELETON */}
        <section className="md:hidden">
          <div className="swiper w-full">
            <div className="swiper-wrapper">
              <Swiper
                direction="horizontal"
                spaceBetween={10}
                slidesPerView="auto"
                slidesOffsetAfter={5}
                slidesOffsetBefore={5}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <SwiperSlide
                    key={`skeleton-mobile-${i}`}
                    className="!w-fit first-of-type:pl-[calc((50%-1130px-60px)/2)] last-of-type:pr-[calc((50%-1130px-60px)/2)]"
                  >
                    <CategoryCardSkeleton />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
        {/* WEB SKELETON */}
        <section className="hidden md:block flex-col gap-[30px]">
          <div className="w-full max-w-[1130px] mx-auto flex items-center justify-between">
            <h2 className="font-bold text-[32px] leading-[48px] text-nowrap text-primary mt-10 mb-10">
              Cek Kategori Favorit Kami
            </h2>
            <div className="font-bold text-primary">
              Explore All
            </div>
          </div>
          <div className="swiper w-full">
            <div className="swiper-wrapper">
              <Swiper
                direction="horizontal"
                spaceBetween={20}
                slidesPerView="auto"
                slidesOffsetAfter={30}
                slidesOffsetBefore={-200}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <SwiperSlide
                    key={`skeleton-web-${i}`}
                    className="!w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]"
                  >
                    <CategoryCardSkeleton />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Create bundling category object
  const bundlingCategory = {
    id: 9999, // Use a unique ID that won't conflict
    name: "Bundling",
    slug: "bundling",
    photo: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop&crop=center&auto=format&q=80", // Camera gear bundling image
    products_count: 0,
    products: []
  };

  // Combine bundling category with regular categories
  const allCategories = [bundlingCategory, ...categories];

  return (
    <>
      {/* MOBILE */}
      <section className="md:hidden scroll-fade-in">
        <div className="swiper w-full scroll-fade-in" data-delay="200">
          <div className="swiper-wrapper">
            <Swiper
              direction="horizontal"
              spaceBetween={10}
              slidesPerView="auto"
              slidesOffsetAfter={5}
              slidesOffsetBefore={5}
            >
              {allCategories.map((category, _index) => (
                <SwiperSlide
                  key={category.id}
                  className="!w-fit first-of-type:pl-[calc((50%-1130px-60px)/2)] last-of-type:pr-[calc((50%-1130px-60px)/2)]"
                >
                  <Link to={category.slug === "bundling" ? `/bundlings` : `/category/${category.slug}`}>
                    <CategoryCard category={category}></CategoryCard>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      {/* WEB */}
      <section
        id="Cities"
        className="hidden md:block flex-col gap-[30px] scroll-fade-in"
      >
        <div className="w-full max-w-[1130px] mx-auto flex items-center justify-between scroll-fade-in">
          <h2 className="font-bold text-[32px] leading-[48px] text-nowrap text-primary mt-10 mb-10 scroll-fade-in">
            Cek Kategori Favorit Kami
          </h2>
          <Link
            to="/browse-product"
            className="font-bold text-primary scroll-slide-right"
          >
            Explore All
          </Link>
        </div>
        <div className="swiper w-full">
          <div className="swiper-wrapper">
            <Swiper
              direction="horizontal"
              spaceBetween={20}
              slidesPerView="auto"
              slidesOffsetAfter={30}
              slidesOffsetBefore={-200}
            >
              {allCategories.map((category, index) => (
                <SwiperSlide
                  key={category.id}
                  className="!w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)] stagger-item"
                  data-index={index}
                >
                  <Link to={category.slug === "bundling" ? `/bundlings` : `/category/${category.slug}`}>
                    <CategoryCard category={category}></CategoryCard>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
}
