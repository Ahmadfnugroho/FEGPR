import { Swiper } from "swiper/react";
import { SwiperSlide } from "swiper/react";
import CategoryCard from "../components/CategoryCard.";
import { useEffect, useState, useCallback } from "react";
import { Category } from "../types/type";
import axios from "axios";
import { Link } from "react-router-dom";
export default function BrowseCategoryWrapper() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(() => {
    const controller = new AbortController();
    axios
      .get("http://gpr.test/api/categories", {
        headers: {
          "X-API-KEY": "6cNWymcs6W094LdZm9pa326lGlS4rEYx",
        },
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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      {/* MOBILE */}
      <section className="md:hidden ">
        <div className="swiper w-full">
          <div className="swiper-wrapper">
            <Swiper
              direction="horizontal"
              spaceBetween={10}
              slidesPerView="auto"
              slidesOffsetAfter={5}
              slidesOffsetBefore={5}
            >
              {categories.map((category) => (
                <SwiperSlide
                  key={category.id}
                  className="!w-fit first-of-type:pl-[calc((50%-1130px-60px)/2)] last-of-type:pr-[calc((50%-1130px-60px)/2)]"
                >
                  <Link to={`/category/${category.slug}`}>
                    <CategoryCard category={category}></CategoryCard>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      {/* WEB */}
      <section id="Cities" className="hidden md:block flex-col gap-[30px]">
        <div className="w-full max-w-[1130px] mx-auto flex items-center justify-between">
          <h2 className="font-bold text-[32px] leading-[48px] text-nowrap text-primary mt-10 mb-10">
            Cek <br />
            Kategori Favorit Kami
          </h2>
          <a href="#" className="font-bold text-primary">
            Explore All
          </a>
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
              {categories.map((category) => (
                <SwiperSlide
                  key={category.id}
                  className="!w-fit first-of-type:pl-[calc((100%-1130px-60px)/2)] last-of-type:pr-[calc((100%-1130px-60px)/2)]"
                >
                  <Link to={`/category/${category.slug}`}>
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
