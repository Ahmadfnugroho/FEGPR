// src/wrappers/BrowseProductWrapper.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import { Product } from "../types/type";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

export default function BrowseProductWrapper() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("http://gpr.id/api/BrowseProduct", {
        // ✅ Endpoint benar: produk unggulan (premiere=1)
        headers: {
          "X-API-KEY": "gbTnWu4oBizYlgeZ0OPJlbpnG11ARjsf",
        },
        signal: controller.signal,
      })
      .then((response) => {
        setProducts(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request dibatalkan");
        } else {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Memuat produk unggulan...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (products.length === 0) {
    return (
      <section
        id="Fresh-Space"
        className="max-w-[1280px] mx-auto mt-[50px] px-3 py-6 text-center"
      >
        <h2 className="font-bold text-[32px] text-dark dark:text-light">
          Tidak ada produk unggulan saat ini.
        </h2>
      </section>
    );
  }

  return (
    <section
      id="Fresh-Space"
      className="flex flex-col gap-5 md:gap-[30px] max-w-[1280px] mx-auto mt-0 md:mt-[50px] bg-transparent md:bg-white/80 dark:md:bg-gray-900 dark:border-gray-700 px-3 md:px-3 py-4 md:py-6 md:shadow md:backdrop-blur-lg md:rounded-3xl scroll-fade-in"
    >
      {/* Hide heading on mobile since it's shown in parent section */}
      <div
        className="relative w-full max-w-[1130px] mx-auto mb-[30px] scroll-fade-in"
        data-delay="300"
      >
        {/* Judul di tengah */}
        <h2
          className="text-center font-bold text-[24px] md:text-[32px] leading-[36px] md:leading-[48px] text-dark dark:text-light scroll-fade-in"
          data-delay="200"
        >
          Produk Unggulan Kami
        </h2>

        {/* Link di kanan */}
        <Link
          to="/browse-product"
          className="absolute right-0 top-1/2 -translate-y-1/2 font-bold text-support-light-secondary dark:text-support-light-border-subtle whitespace-nowrap scroll-fade-in"
        >
          Explore All
        </Link>
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-[20px] stagger-fade-in"
        data-delay="400"
      >
        {products.map((product, index) => (
          <Link
            key={product.id}
            to={`/product/${product.slug}`}
            className="stagger-item"
            data-index={index}
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </section>
  );
}
