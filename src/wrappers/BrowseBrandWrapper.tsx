import { useEffect, useState, useCallback } from "react";
import BrandCard from "../components/BrandCard";
import { Brand } from "../types/type";
import axios from "axios";
import FullScreenLoader from "../components/FullScreenLoader";

export default function BrowseBrandWrapper() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(() => {
    const controller = new AbortController();
    axios
      .get("https://gpr-b5n3q.sevalla.app/api/brands-premiere", {
        headers: {
          "X-API-KEY": "gbTnWu4oBizYlgeZ0OPJlbpnG11ARjsf",
        },
        signal: controller.signal,
      })
      .then((response) => {
        setBrands(response.data.data);
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
    const abortFetch = fetchBrands();
    return () => {
      abortFetch();
    };
  }, [fetchBrands]);

  if (loading) {
    return (
      <div>
        <FullScreenLoader />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div
      className="w-full bg-[#c5c7cb] dark:bg-[#222429] py-4 md:py-10 px-3 md:px-[120px] scroll-fade-in mt-28"
      data-delay="100"
    >
      <div
        className="flex flex-wrap justify-center items-center gap-3 md:gap-8 stagger-fade-in"
        data-staggerdelay="100"
      >
        {brands.map((brand, index) => (
          <div key={brand.id} className="stagger-item" data-index={index}>
            <BrandCard brand={brand} />
          </div>
        ))}
      </div>
    </div>
  );
}
