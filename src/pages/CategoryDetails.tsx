import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Category } from "../types/type";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import NavCard from "../components/navCard";
import FullScreenLoader from "../components/FullScreenLoader";

export default function CategoryDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`http://gpr.id/api/category/${slug}`, {
        headers: {
          "X-API-KEY": "gbTnWu4oBizYlgeZ0OPJlbpnG11ARjsf",
        },
      })
      .then((response) => {
        setCategory(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <FullScreenLoader />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!category) {
    return <p>Category not found</p>;
  }

  const baseURL = "http://gpr.id/storage";
  return (
    <>
      <NavCard></NavCard>

      <header className="flex flex-col w-full">
        <section
          id="Hero-Banner"
          className="relative flex h-[434px] parallax-container overflow-hidden"
        >
          <div
            id="Hero-Text"
            className="relative flex flex-col w-full max-w-[650px] h-fit rounded-[30px] border border-[#E0DEF7] 
             p-10 gap-[30px] bg-white mt-[70px] ml-[calc((100%-1130px)/2)] 
             z-10 text-support-primary dark:text-support-light-primary"
          >
            <h1 className="font-extrabold text-[50px] leading-[60px]">
              Cari <span>{category.name} </span>
              Terbaik
              <span>
                <br /> Disini!
              </span>
            </h1>
            <p className="text-lg leading-1">
              Alat yang tepat dapat memberikan dampak positif pada hasil foto
              dan video, meningkatkan kualitas karya, serta mendukung
              perkembangan keterampilan fotografi atau videografi Anda.
            </p>
          </div>

          <div
            id="Hero-Image"
            className="absolute right-0 w-[calc(100%-((100%-1130px)/2)-305px)] h-[434px] rounded-bl-[40px] overflow-hidden parallax-bg"
            data-parallax-speed="-0.15"
          >
            <img
              src={`${baseURL}/${category.photo}`}
              className="w-full h-full object-cover scale-110"
              alt="hero background"
            />
          </div>
        </section>
      </header>
      <section
        id="Fresh-Space"
        className="flex flex-col gap-[30px] w-full max-w-[1130px] mx-auto mt-[70px] mb-[120px] scroll-fade-in"
      >
        <h2 className="font-bold text-[32px] leading-[48px] text-nowrap scroll-fade-in">
          Browse Product
        </h2>

        <div className="grid grid-cols-3 gap-[30px] stagger-fade-in">
          {category.products.map((product, index) => (
            <div key={product.id} className="stagger-item" data-index={index}>
              <Link to={`/product/${product.slug}`}>
                <ProductCard product={product}></ProductCard>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
