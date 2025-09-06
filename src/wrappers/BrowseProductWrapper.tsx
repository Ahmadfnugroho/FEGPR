// src/wrappers/BrowseProductWrapper.tsx
import axios from "axios";
import axiosInstance from "../api/axiosInstance";
import { useEffect, useState } from "react";
import { Product } from "../types/type";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { Link } from "react-router-dom";

export default function BrowseProductWrapper() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    axiosInstance
      .get("/BrowseProduct", {
        // ✅ Endpoint benar: produk unggulan (premiere=1)
        signal: controller.signal,
      })
      .then((response) => {
        // Add null/undefined checks for response data
        if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          console.warn("Invalid products data received:", response.data);
          setProducts([]);
        }
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
    return (
      <section
        id="Fresh-Space"
      className="flex flex-col gap-5 md:gap-[30px] max-w-[1280px] mx-auto mt-0 md:mt-[50px] bg-transparent md:bg-white/80 px-4 md:px-6 py-4 md:py-6 md:shadow md:backdrop-blur-lg md:rounded-3xl"
    >
        <div className="w-full max-w-[1130px] mx-auto mb-5 md:mb-[30px]">
          {/* Mobile Layout - Stack vertically */}
          <div className="block md:hidden text-center space-y-2">
            <h2 className="font-bold text-[20px] leading-[30px] text-support-light-primary">
              🌟 Produk Unggulan Kami
            </h2>
            <Link 
              to="/browse-product" 
              className="inline-block font-bold text-sm text-primary hover:text-primary-hover transition-colors"
            >
              Selengkapnya
            </Link>
          </div>
          
          {/* Desktop Layout - Side by side */}
          <div className="hidden md:flex items-center justify-between">
            <h2 className="font-bold text-[32px] leading-[48px] text-support-light-primary">
              🌟 Produk Unggulan Kami
            </h2>
            <Link 
              to="/browse-product" 
              className="font-bold text-primary hover:text-primary-hover transition-colors whitespace-nowrap"
            >
              Selengkapnya
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-[20px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      </section>
    );
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
        <h2 className="font-bold text-[32px] text-dark">
          Tidak ada produk unggulan saat ini.
        </h2>
      </section>
    );
  }

  return (
    <section
      id="Fresh-Space"
      className="flex flex-col gap-5 md:gap-[30px] max-w-[1280px] mx-auto mt-0 md:mt-[50px] bg-transparent md:bg-white/80 px-4 md:px-6 py-4 md:py-6 md:shadow md:backdrop-blur-lg md:rounded-3xl scroll-fade-in"
    >
      <div
        className="w-full max-w-[1130px] mx-auto mb-5 md:mb-[30px] scroll-fade-in"
        data-delay="300"
      >
        {/* Mobile Layout - Stack vertically */}
        <div className="block md:hidden text-center space-y-2">
          <h2 
            className="font-bold text-[20px] leading-[30px] text-support-light-primary scroll-fade-in"
            data-delay="200"
          >
            🌟 Produk Unggulan Kami
          </h2>
          <Link 
            to="/browse-product" 
            className="inline-block font-bold text-sm text-primary hover:text-primary-hover transition-colors scroll-fade-in"
            data-delay="250"
          >
            Selengkapnya
          </Link>
        </div>
        
        {/* Desktop Layout - Side by side */}
        <div className="hidden md:flex items-center justify-between">
          <h2 
            className="font-bold text-[32px] leading-[48px] text-support-light-primary scroll-fade-in"
            data-delay="200"
          >
            🌟 Produk Unggulan Kami
          </h2>
          <Link 
            to="/browse-product" 
            className="font-bold text-primary hover:text-primary-hover transition-colors whitespace-nowrap scroll-fade-in"
            data-delay="250"
          >
            Selengkapnya
          </Link>
        </div>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-[20px] stagger-fade-in"
        data-delay="400"
      >
        {products && Array.isArray(products) && products.length > 0 ? (
          products.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="stagger-item"
              data-index={index}
            >
              <ProductCard product={product} />
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            Tidak ada produk unggulan yang tersedia
          </div>
        )}
      </div>
    </section>
  );
}
