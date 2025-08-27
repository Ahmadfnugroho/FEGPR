import { useEffect, useState, useCallback } from "react";
import BrandCard from "../components/BrandCard";
import { Brand } from "../types/type";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";
import BrandCardSkeleton from "../components/BrandCardSkeleton";

export default function BrowseBrandWrapper() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(() => {
    const controller = new AbortController();
    axiosInstance
      .get("/brands-premiere", {
        signal: controller.signal,
      })
      .then((response) => {
        // Add null/undefined checks for response data
        if (response.data && Array.isArray(response.data.data)) {
          setBrands(response.data.data);
        } else {
          console.warn('Invalid brands data received:', response.data);
          setBrands([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel && axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          setError(error.message);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const abortFetch = fetchBrands();
    return () => {
      abortFetch();
    };
  }, [fetchBrands]);

  if (loading) {
    return (
      <div className="w-auto bg-[#c5c7cb] py-4 md:py-3 px-3 md:px-3 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex flex-nowrap justify-center items-center gap-2 md:gap-16 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <BrandCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div
      className="w-auto bg-[#c5c7cb] py-4 md:py-3 px-3 md:px-3 scroll-fade-in rounded-2xl shadow-lg border border-gray-200"
      data-delay="100"
    >
      <div
        className="flex flex-nowrap justify-center items-center gap-2 md:gap-16 stagger-fade-in overflow-x-auto"
        data-staggerdelay="100"
      >
        {brands && Array.isArray(brands) && brands.length > 0 ? brands.map((brand, index) => (
          <div key={brand.id} className="stagger-item" data-index={index}>
            <BrandCard brand={brand} />
          </div>
        )) : (
          <div className="text-center text-gray-500 py-4">
            Tidak ada brand yang tersedia
          </div>
        )}
      </div>
    </div>
  );
}
