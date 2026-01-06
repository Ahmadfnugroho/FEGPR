import { useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export type Suggestion = {
  id: string | number;
  type: "product" | "bundling";
  name: string;
  slug?: string;
  url?: string;
  thumbnail?: string;
  price?: number;
  is_available?: boolean;
  [k: string]: any;
};

type Options = {
  debounceMs?: number;
  productLimit?: number;
  bundlingLimit?: number;
  enabled?: boolean;
};

export default function useSearchSuggestions(
  query: string,
  opts: Options = {}
) {
  const {
    debounceMs = 300,
    productLimit = 10,
    bundlingLimit = 5,
    enabled = true,
  } = opts;
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [productsGroup, setProductsGroup] = useState<Suggestion[]>([]);
  const [bundlingsGroup, setBundlingsGroup] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !query || query.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(async () => {
      // abort previous
      if (abortRef.current) {
        try {
          abortRef.current.abort();
        } catch (e) {}
      }
      abortRef.current = new AbortController();

      setLoading(true);

      try {
        const productReq = axiosInstance.get("/search-suggestions", {
          params: { q: query, limit: productLimit },
          signal: abortRef.current.signal,
        });

        const bundlingReq = axiosInstance.get("/bundlings", {
          params: { q: query, limit: bundlingLimit },
          signal: abortRef.current.signal,
        });

        const [prodRes, bundRes] = await Promise.allSettled([
          productReq,
          bundlingReq,
        ]);

        let results: Suggestion[] = [];

        if (prodRes.status === "fulfilled") {
          const prodData =
            prodRes.value.data.suggestions || prodRes.value.data.data || [];
          const mapped = (prodData as any[]).map((p: any) => ({
            id: p.id ?? p.slug ?? p.name,
            type: "product" as const,
            name: p.name || p.display || "",
            slug: p.slug || p.slug?.toString(),
            url: p.url || (p.slug ? `/product/${p.slug}` : undefined),
            thumbnail: p.thumbnail || p.productPhotos?.[0]?.photo || p.photo,
            price: p.price ?? p.min_price ?? undefined,
            is_available: p.is_available,
            ...p,
          }));
          results = results.concat(mapped.slice(0, productLimit));
        }

        if (bundRes.status === "fulfilled") {
          const bundData = bundRes.value.data.data || [];
          const mapped = (bundData as any[]).map((b: any) => ({
            id: b.id ?? b.slug ?? b.name,
            type: "bundling" as const,
            name: b.name || b.display || "",
            slug: b.slug,
            url: `/bundling/${b.slug}`,
            thumbnail:
              b.bundlingPhotos?.[0]?.photo ||
              b.products?.[0]?.productPhotos?.[0]?.photo,
            price: b.price ?? undefined,
            is_available: b.is_available,
            ...b,
          }));
          results = results.concat(mapped.slice(0, bundlingLimit));
        }

        // Score & sort results by relevance + popularity + availability
        const q = (query || "").toLowerCase().trim();

        const scored = results.map((it) => {
          const name = String(it.name || "").toLowerCase();
          let score = 0;

          if (name === q) score += 100; // exact
          else if (name.startsWith(q)) score += 70; // prefix
          else if (name.includes(q)) score += 40; // substring
          else score += 10; // fallback small score

          // availability boost
          if (it.is_available) score += 10;

          // popularity bonus (if available on item)
          const popularity = Number(it.popularity || it.views || it.sales || 0);
          return { item: it, baseScore: score, popularity };
        });

        const maxPop = Math.max(1, ...scored.map((s) => s.popularity || 0));

        const withFinal = scored.map((s) => {
          const popBonus = (s.popularity / (maxPop || 1)) * 20; // up to 20
          const finalScore = s.baseScore + popBonus;
          return { ...s.item, __score: finalScore } as Suggestion & {
            __score: number;
          };
        });

        withFinal.sort((a, b) => {
          const sa = (a as any).__score || 0;
          const sb = (b as any).__score || 0;
          if (sb !== sa) return sb - sa;
          // tie-breaker: available first
          const ava = (a.is_available ? 1 : 0) - (b.is_available ? 1 : 0);
          if (ava !== 0) return ava * -1;
          // next by popularity
          const pa = Number(a.popularity || a.views || a.sales || 0);
          const pb = Number(b.popularity || b.views || b.sales || 0);
          if (pb !== pa) return pb - pa;
          // finally alphabetical
          return String(a.name || "").localeCompare(String(b.name || ""));
        });

        // Split into groups while preserving order and limits
        const prods = withFinal
          .filter((i) => i.type === "product")
          .slice(0, productLimit);
        const bunds = withFinal
          .filter((i) => i.type === "bundling")
          .slice(0, bundlingLimit);

        // merged suggestions for backward compatibility
        const merged = [...prods, ...bunds].slice(
          0,
          productLimit + bundlingLimit
        );

        setProductsGroup(prods);
        setBundlingsGroup(bunds);
        setSuggestions(merged);
      } catch (err) {
        // ignore cancellations
        // console.error(err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      // do not abort here — abort when next request starts
    };
  }, [query, debounceMs, productLimit, bundlingLimit, enabled]);

  // abort on unmount
  useEffect(() => {
    return () => {
      try {
        abortRef.current?.abort();
      } catch (e) {}
    };
  }, []);

  return {
    suggestions,
    loading,
    products: productsGroup,
    bundlings: bundlingsGroup,
  } as const;
}
