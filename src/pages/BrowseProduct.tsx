import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactSelect from "react-select";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import NavCard from "../components/navCard";
import ProductSkeleton from "../components/ProductSkeleton";
import PriceRange from "../components/PriceRange";
import ProductCard from "../components/ProductCard";
import BundlingCard from "../components/BundlingCard";
import type {
  Product,
  Category,
  Brand,
  SubCategory,
  Bundling,
} from "../types/type";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const API_BASE = "http://gpr.id/api";
const API_KEY = "gbTnWu4oBizYlgeZ0OPJlbpnG11ARjsf";

const sortOptions = [
  { label: "Nama (A-Z)", value: "name_asc" },
  { label: "Harga Terendah", value: "price_asc" },
  { label: "Harga Tertinggi", value: "price_desc" },
  { label: "Rekomendasi", value: "recommended" },
  { label: "Terbaru", value: "latest" },
  { label: "Ketersediaan", value: "availability" },
];

export default function BrowseProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  // Data
  const [products, setProducts] = useState<Product[]>([]);
  const [bundlings, setBundlings] = useState<Bundling[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination & infinite load
  const [page, setPage] = useState(Number(params.get("page") || 1));
  const [pageSize, setPageSize] = useState(Number(params.get("limit") || 10));
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filter / sort
  const [filter, setFilter] = useState({
    category: params.getAll("category") || [],
    brand: params.getAll("brand") || [],
    subcategory: params.getAll("subcategory") || [],
    available: params.getAll("available") || [],
    q: params.get("q") || "",
  });

  // Check if "bundling" category is selected
  const isBundlingMode = filter.category.includes("bundling");
  // Gunakan state terpisah untuk harga
  // Price filter: null = not active
  const [priceRange, setPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [sort, setSort] = useState(params.get("sort") || "name");
  const [order, setOrder] = useState<"asc" | "desc">(
    (params.get("order") as "asc" | "desc") || "asc"
  );
  // State sementara untuk filter di sidebar/drawer
  const [tempFilter, setTempFilter] = useState(filter);
  const [tempPriceRange, setTempPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);

  // Sidebar / drawer
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Price range
  const [priceBounds, setPriceBounds] = useState<{ min: number; max: number }>({
    min: 0,
    max: 10000000,
  });

  // Refs
  const cancelTokenRef = useRef<any>(null);

  // Options for react-select
  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.slug,
  }));
  const brandOptions = brands.map((b) => ({ label: b.name, value: b.slug }));
  const subCategoryOptions = subCategories.map((s) => ({
    label: s.name,
    value: s.slug,
  }));

  // Shared ReactSelect styles (soft)
  const rsStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: "transparent",
      borderColor: "hsl(210, 10%, 85%)",
      boxShadow: "none",
      minHeight: "40px",
      "&:hover": { borderColor: "rgba(219,147,46,0.9)" },
    }),
    menu: (base: any) => ({ ...base, zIndex: 9999 }),
    option: (base: any, { isSelected, isFocused }: any) => ({
      ...base,
      backgroundColor: isSelected
        ? "#FBBF24"
        : isFocused
        ? "rgba(251,191,36,0.07)"
        : "white",
      color: isSelected ? "#0f172a" : "#111827",
    }),
  };

  // Build params helper
  const buildParams = useCallback(
    (p: number = 1) => {
      const ps = new URLSearchParams();
      if (filter.q) ps.set("q", filter.q);
      filter.category.forEach((c) => ps.append("category", c));
      filter.brand.forEach((b) => ps.append("brand", b));
      filter.subcategory.forEach((s) => ps.append("subcategory", s));
      filter.available.forEach((a) => ps.append("available", a));

      // Only add if priceRange is set and values are valid
      if (
        priceRange &&
        typeof priceRange.min === "number" &&
        !isNaN(priceRange.min)
      ) {
        ps.set("price_min", String(priceRange.min));
      }
      if (
        priceRange &&
        typeof priceRange.max === "number" &&
        !isNaN(priceRange.max)
      ) {
        ps.set("price_max", String(priceRange.max));
      }

      if (sort && sort !== "name") ps.set("sort", sort);
      if (order && !["recommended", "latest", "availability"].includes(sort)) {
        if (order !== "asc") ps.set("order", order);
      }
      ps.set("page", String(p));
      ps.set("limit", String(pageSize));
      return ps;
    },
    [filter, priceRange, sort, order, pageSize]
  );
  // Fetch static lists once
  useEffect(() => {
    axios
      .all([
        axios.get(`${API_BASE}/categories`, {
          headers: { "X-API-KEY": API_KEY },
        }),
        axios.get(`${API_BASE}/brands`, { headers: { "X-API-KEY": API_KEY } }),
        axios.get(`${API_BASE}/sub-categories`, {
          headers: { "X-API-KEY": API_KEY },
        }),
      ])
      .then(
        axios.spread((catRes, brandRes, subRes) => {
          setCategories(catRes.data.data || []);
          setBrands(brandRes.data.data || []);
          setSubCategories(subRes.data.data || []);
        })
      )
      .catch((e) => console.error("Static list fetch error:", e));
  }, []);

  // Fetch bundlings
  const fetchBundlings = useCallback(
    async (p = 1, append = false) => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Cancelled by new request");
      }
      cancelTokenRef.current = axios.CancelToken.source();

      try {
        if (append) setLoadingMore(true);
        else setLoading(true);

        const bundlingParams = new URLSearchParams();
        if (filter.q) bundlingParams.set("q", filter.q);
        if (sort && sort !== "name") bundlingParams.set("sort", sort);
        if (
          order &&
          !["recommended", "latest", "availability"].includes(sort)
        ) {
          if (order !== "asc") bundlingParams.set("order", order);
        }
        bundlingParams.set("page", String(p));
        bundlingParams.set("limit", String(pageSize));

        const res = await axios.get(`${API_BASE}/bundlings`, {
          headers: { "X-API-KEY": API_KEY },
          params: Object.fromEntries(bundlingParams),
          cancelToken: cancelTokenRef.current.token,
        });

        const data = res.data.data || [];
        const meta = res.data.meta || {};

        // Calculate price bounds from bundling data
        const prices = data
          .map((it: any) => Number(it.price ?? 0))
          .filter(Boolean);
        if (prices.length) {
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceBounds((prev) => ({
            min: Math.min(prev.min || Infinity, min),
            max: Math.max(prev.max || 0, max),
          }));
        }

        setTotalPages(meta.last_page ?? 1);
        setHasMore(p < (meta.last_page ?? 1));

        if (append) {
          setBundlings((prev) => [...prev, ...data]);
        } else {
          setBundlings(data);
        }
        setPage(p);
        setError(null);
      } catch (err: any) {
        if (!axios.isCancel(err))
          setError(err.message || "Gagal memuat bundling");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filter.q, sort, order, pageSize]
  );

  // Fetch products (initial or filter change)
  const fetchProducts = useCallback(
    async (p = 1, append = false) => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Cancelled by new request");
      }
      cancelTokenRef.current = axios.CancelToken.source();

      try {
        if (append) setLoadingMore(true);
        else setLoading(true);

        const res = await axios.get(`${API_BASE}/products`, {
          headers: { "X-API-KEY": API_KEY },
          params: Object.fromEntries(buildParams(p)),
          cancelToken: cancelTokenRef.current.token,
        });

        const data = res.data.data || [];
        const meta = res.data.meta || {};
        if (meta.min_price !== undefined && meta.max_price !== undefined) {
          setPriceBounds({
            min: Number(meta.min_price),
            max: Number(meta.max_price),
          });
        } else {
          const prices = data
            .map((it: any) => Number(it.price ?? 0))
            .filter(Boolean);
          if (prices.length) {
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            setPriceBounds((prev) => ({
              min: Math.min(prev.min || Infinity, min),
              max: Math.max(prev.max || 0, max),
            }));
          }
        }

        setTotalPages(meta.last_page ?? 1);
        setHasMore(p < (meta.last_page ?? 1));

        if (append) {
          setProducts((prev) => [...prev, ...data]);
        } else {
          setProducts(data);
        }
        setPage(p);
        setError(null);
      } catch (err: any) {
        if (!axios.isCancel(err))
          setError(err.message || "Gagal memuat produk");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [buildParams, priceRange]
  );

  // Initial load or when filter/sort/pageSize changes
  useEffect(() => {
    // Sync URL for deep-linkable state
    const sp = buildParams(1);
    navigate({ search: sp.toString() }, { replace: true });

    // Reset other data when switching modes
    if (isBundlingMode) {
      setProducts([]);
      setBundlings([]);
      fetchBundlings(1, false);
    } else {
      setBundlings([]);
      setProducts([]);
      fetchProducts(1, false);
    }

    // Sync temp filters with main filters
    setTempFilter(filter);
    setTempPriceRange(priceRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sort, order, pageSize, priceRange, isBundlingMode]);

  // Load more handler (infinite with button)
  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    if (isBundlingMode) {
      fetchBundlings(nextPage, true);
    } else {
      fetchProducts(nextPage, true);
    }
  };

  // updateSort implementation
  function updateSort(val: string) {
    if (val === "recommended" || val === "latest" || val === "availability") {
      setSort(val);
      setOrder("asc");
    } else {
      const [s, o] = val.split("_");
      setSort(s);
      setOrder((o as "asc" | "desc") || "asc");
    }
  }

  // apply/reset helpers
  const applyTempFilter = () => {
    setFilter(tempFilter);
    setPriceRange(tempPriceRange);
    setDrawerOpen(false);
  };

  const resetFilters = () => {
    const newFilter = {
      category: [],
      brand: [],
      subcategory: [],
      available: [],
      q: "",
    };
    setFilter(newFilter);
    setTempFilter(newFilter);
    setPriceRange(null); // Reset to null (not active)
    setTempPriceRange(null);
    setDrawerOpen(false);
  };

  // body scroll lock for drawer
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [drawerOpen]);

  return (
    <>
      <NavCard />

      <main className="pt-24 pb-24 transition-all duration-300 bg-base-light-primary dark:bg-base-dark-primary">
        <section className="container grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar desktop (collapsible) */}
          <aside
            className={`hidden lg:block transition-all duration-300 ${
              sidebarCollapsed ? "w-16" : "w-auto"
            }`}
            aria-hidden={false}
          >
            <div
              className={`bg-base-secondary border border-support-subtle rounded-lg p-3 shadow-sm transition-theme ${
                sidebarCollapsed ? "overflow-hidden" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-sm font-semibold text-support-primary ${
                    sidebarCollapsed ? "sr-only" : ""
                  }`}
                >
                  Filter
                </h3>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-md text-support-secondary hover:bg-base-tertiary hover:text-pop-primary transition-all duration-200"
                >
                  {sidebarCollapsed ? (
                    <FaChevronRight size={20} />
                  ) : (
                    <FaChevronLeft size={20} />
                  )}
                </button>
              </div>

              <div className={sidebarCollapsed ? "hidden" : "block"}>
                <label className="text-xs text-support-tertiary mb-1 block">
                  Kategori
                </label>
                <ReactSelect
                  isMulti
                  options={categoryOptions}
                  value={categoryOptions.filter((opt) =>
                    tempFilter.category.includes(opt.value)
                  )}
                  onChange={(sel: any) =>
                    setTempFilter((p) => ({
                      ...p,
                      category: sel.map((s: any) => s.value),
                    }))
                  }
                  styles={rsStyles}
                  placeholder="Semua Kategori"
                  className="mb-3"
                />

                <label className="text-xs text-support-tertiary mb-1 block">
                  Brand
                </label>
                <ReactSelect
                  isMulti
                  options={brandOptions}
                  value={brandOptions.filter((opt) =>
                    tempFilter.brand.includes(opt.value)
                  )}
                  onChange={(sel: any) =>
                    setTempFilter((p) => ({
                      ...p,
                      brand: sel.map((s: any) => s.value),
                    }))
                  }
                  styles={rsStyles}
                  placeholder="Semua Brand"
                  className="mb-3"
                />

                <label className="text-xs text-support-tertiary mb-1 block">
                  SubKategori
                </label>
                <ReactSelect
                  isMulti
                  options={subCategoryOptions}
                  value={subCategoryOptions.filter((opt) =>
                    tempFilter.subcategory.includes(opt.value)
                  )}
                  onChange={(sel: any) =>
                    setTempFilter((p) => ({
                      ...p,
                      subcategory: sel.map((s: any) => s.value),
                    }))
                  }
                  styles={rsStyles}
                  placeholder="Semua SubKategori"
                  className="mb-3"
                />

                <label className="text-xs text-support-tertiary mb-1 block">
                  Status
                </label>
                <ReactSelect
                  isMulti
                  options={[
                    { label: "Tersedia", value: "1" },
                    { label: "Tidak Tersedia", value: "0" },
                  ]}
                  value={[
                    { label: "Tersedia", value: "1" },
                    { label: "Tidak Tersedia", value: "0" },
                  ].filter((opt) => tempFilter.available.includes(opt.value))}
                  onChange={(sel: any) =>
                    setTempFilter((p) => ({
                      ...p,
                      available: sel.map((s: any) => s.value),
                    }))
                  }
                  styles={rsStyles}
                  placeholder="Semua Status"
                  className="mb-3"
                />

                <label className="text-xs text-support-tertiary mb-2 block">
                  Harga
                </label>
                <PriceRange
                  min={priceBounds.min}
                  max={priceBounds.max}
                  valueMin={tempPriceRange?.min ?? null}
                  valueMax={tempPriceRange?.max ?? null}
                  onChange={(min, max) => {
                    setTempPriceRange(
                      min == null && max == null
                        ? null
                        : {
                            min: min ?? priceBounds.min,
                            max: max ?? priceBounds.max,
                          }
                    );
                  }}
                />
                {/* Badge if price filter is active */}
                {priceRange &&
                  (priceRange.min != null || priceRange.max != null) && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-semantic-warning text-white rounded">
                      Filter harga aktif
                    </span>
                  )}

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={applyTempFilter}
                    className="flex-1 px-3 py-2 rounded bg-pop-primary text-white transition hover:bg-pop-hover"
                  >
                    Terapkan
                  </button>
                  <button
                    onClick={resetFilters}
                    className="px-3 py-2 rounded border border-support-subtle text-support-tertiary transition hover:bg-base-tertiary"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile drawer/backdrop */}
          {drawerOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setDrawerOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-dark/95 p-4 overflow-auto shadow-xl transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium">Filter</h3>
                  <button onClick={() => setDrawerOpen(false)} className="p-1">
                    ✕
                  </button>
                </div>

                <label className="text-xs text-muted dark:text-muted-dark mb-1 block">
                  Kategori
                </label>
                <ReactSelect
                  isMulti
                  options={categoryOptions}
                  value={categoryOptions.filter((opt) =>
                    tempFilter.category.includes(opt.value)
                  )}
                  onChange={(sel: any) =>
                    setTempFilter((p) => ({
                      ...p,
                      category: sel.map((s: any) => s.value),
                    }))
                  }
                  styles={rsStyles}
                  className="mb-3"
                />

                <label className="text-xs text-muted dark:text-muted-dark mb-1 block">
                  Brand
                </label>
                <ReactSelect
                  isMulti
                  options={brandOptions}
                  value={brandOptions.filter((opt) =>
                    tempFilter.brand.includes(opt.value)
                  )}
                  onChange={(sel: any) =>
                    setTempFilter((p) => ({
                      ...p,
                      brand: sel.map((s: any) => s.value),
                    }))
                  }
                  styles={rsStyles}
                  className="mb-3"
                />

                <label className="text-xs text-muted dark:text-muted-dark mb-1 block">
                  SubKategori
                </label>
                <ReactSelect
                  isMulti
                  options={subCategoryOptions}
                  value={subCategoryOptions.filter((opt) =>
                    tempFilter.subcategory.includes(opt.value)
                  )}
                  onChange={(sel: any) =>
                    setTempFilter((p) => ({
                      ...p,
                      subcategory: sel.map((s: any) => s.value),
                    }))
                  }
                  styles={rsStyles}
                  className="mb-3"
                />

                <label className="text-xs text-muted dark:text-muted-dark mb-1 block">
                  Status
                </label>
                <ReactSelect
                  isMulti
                  options={[
                    { label: "Tersedia", value: "1" },
                    { label: "Tidak Tersedia", value: "0" },
                  ]}
                  value={[
                    { label: "Tersedia", value: "1" },
                    { label: "Tidak Tersedia", value: "0" },
                  ].filter((opt) => tempFilter.available.includes(opt.value))}
                  onChange={(sel: any) =>
                    setTempFilter((p) => ({
                      ...p,
                      available: sel.map((s: any) => s.value),
                    }))
                  }
                  styles={rsStyles}
                  className="mb-3"
                />

                <label className="text-xs text-muted dark:text-muted-dark mb-2 block">
                  Harga
                </label>
                <PriceRange
                  min={priceBounds.min}
                  max={priceBounds.max}
                  valueMin={tempPriceRange?.min ?? null}
                  valueMax={tempPriceRange?.max ?? null}
                  onChange={(min, max) => {
                    setTempPriceRange(
                      min == null && max == null
                        ? null
                        : {
                            min: min ?? priceBounds.min,
                            max: max ?? priceBounds.max,
                          }
                    );
                  }}
                />

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={applyTempFilter}
                    className="flex-1 px-3 py-2 rounded bg-primary text-white transition"
                  >
                    Terapkan
                  </button>
                  <button
                    onClick={resetFilters}
                    className="px-3 py-2 rounded border border-muted text-muted transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main content */}
          <div
            className={`col-span-1 ${
              sidebarCollapsed ? "lg:col-span-4" : "lg:col-span-3"
            }`}
          >
            {" "}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden px-3 py-2 rounded bg-white dark:bg-dark border border-light dark:border-dark shadow-sm"
                  onClick={() => setDrawerOpen(true)}
                >
                  Filter
                </button>

                <div className="hidden sm:flex items-center gap-2 text-sm text-muted dark:text-muted-dark">
                  <label className="mr-2">Tampilkan</label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="rounded border px-3 py-1 bg-transparent dark:bg-transparent"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={
                    sort === "recommended" ? "recommended" : `${sort}_${order}`
                  }
                  onChange={(e) => updateSort(e.target.value)}
                  className="rounded border px-3 py-2 bg-transparent"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Grid */}
            <div
              aria-live="polite"
              className="transition-all duration-300 scroll-fade-in"
            >
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5 stagger-fade-in">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="stagger-item" data-index={i}>
                      <ProductSkeleton />
                    </div>
                  ))}
                </div>
              ) : isBundlingMode ? (
                bundlings.length === 0 ? (
                  <p className="text-center py-10 text-muted dark:text-muted-dark">
                    Tidak ada bundling yang ditemukan.
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5 stagger-fade-in">
                      {bundlings.map((bundling, index) => (
                        <div
                          key={bundling.id}
                          className="stagger-item"
                          data-index={index}
                        >
                          <Link
                            to={`/bundling/${bundling.slug}`}
                            className="transform hover:-translate-y-1 transition"
                          >
                            <BundlingCard bundling={bundling} />
                          </Link>
                        </div>
                      ))}
                    </div>

                    <div
                      className="flex justify-center mt-6 scroll-fade-in"
                      data-delay="300"
                    >
                      {hasMore ? (
                        <button
                          onClick={loadMore}
                          disabled={loadingMore}
                          className="px-4 py-2 rounded bg-primary text-white hover:opacity-95 transition"
                        >
                          {loadingMore ? "Memuat..." : "Load More"}
                        </button>
                      ) : (
                        <span className="text-sm text-muted dark:text-muted-dark">
                          Sudah menampilkan semua bundling.
                        </span>
                      )}
                    </div>
                  </>
                )
              ) : products.length === 0 ? (
                <p className="text-center py-10 text-muted dark:text-muted-dark">
                  Tidak ada produk yang ditemukan.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5 stagger-fade-in">
                    {products.map((product, index) => (
                      <div
                        key={product.id}
                        className="stagger-item"
                        data-index={index}
                      >
                        <Link
                          to={`/product/${product.slug}`}
                          className="transform hover:-translate-y-1 transition"
                        >
                          <ProductCard product={product} />
                        </Link>
                      </div>
                    ))}
                  </div>

                  <div
                    className="flex justify-center mt-6 scroll-fade-in"
                    data-delay="300"
                  >
                    {hasMore ? (
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="px-4 py-2 rounded bg-primary text-white hover:opacity-95 transition"
                      >
                        {loadingMore ? "Memuat..." : "Load More"}
                      </button>
                    ) : (
                      <span className="text-sm text-muted dark:text-muted-dark">
                        Sudah menampilkan semua produk.
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
