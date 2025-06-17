import { useEffect, useState, useCallback } from "react";
import BrandCard from "../components/BrandCard";
import { Brand } from "../types/type";
import axios from "axios";

export default function BrowseBrandWrapper() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(() => {
    const controller = new AbortController();
    axios
      .get("http://gpr.test/api/brands-premiere", {
        headers: {
          "X-API-KEY": "6cNWymcs6W094LdZm9pa326lGlS4rEYx",
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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <div className="flex flex-col pt-10 md:pt-[150px] pb-10 md:px-[120px] px-5 gap-10 bg-light">
        <div className="logo-container flex items-center justify-between md:justify-center md:flex-wrap  md:h-[38px] h-1 md:mx-auto md:gap-[60px]">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand}></BrandCard>
          ))}
        </div>
      </div>
    </>
  );
}
