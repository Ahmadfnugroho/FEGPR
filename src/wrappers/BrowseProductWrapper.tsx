import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Product } from "../types/type";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

export default function BrowseProductWrapper() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(() => {
    const controller = new AbortController();
    axios
      .get("http://gpr.test/api/BrowseProduct", {
        headers: {
          "X-API-KEY": "6cNWymcs6W094LdZm9pa326lGlS4rEYx",
        },
        signal: controller.signal,
      })
      .then((response) => {
        setProducts(response.data.data);
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
    const abortFetch = fetchProducts();
    return () => {
      abortFetch();
    };
  }, [fetchProducts]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section
      id="Fresh-Space"
      className="flex flex-col gap-[30px]  max-w-[1130px] mx-auto mt-[50px]  bg-white/80 dark:bg-gray-900 dark:border-gray-700 px-3 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl "
    >
      <h2 className="font-bold text-[32px] leading-[48px] text-nowrap text-center text-dark dark:text-light">
        Browse Our Fresh Space.
        <br />
        For Your Better Productivity.
      </h2>
      <div className="grid grid-cols-3 gap-[30px]">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.slug}`}>
            <ProductCard product={product}></ProductCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
