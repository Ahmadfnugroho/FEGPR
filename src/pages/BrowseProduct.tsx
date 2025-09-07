import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/20/solid";
import NavCard from "../components/navCard";
import ProductSkeleton from "../components/ProductSkeleton";
import BundlingCardSkeleton from "../components/BundlingCardSkeleton";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import ProductCard from "../components/ProductCard";
import EnhancedProductCard from "../components/EnhancedProductCard";
import BundlingCard from "../components/BundlingCard";
import MobileFilterDialog from "../components/FilterComponents/MobileFilterDialog";
import DesktopFilterSidebar from "../components/FilterComponents/DesktopFilterSidebar";
import FilterHeader from "../components/FilterComponents/FilterHeader";
import type {
  Product,
  Category,
  Brand,
  SubCategory,
  Bundling,
} from "../types/type";
import axiosInstance from "../api/axiosInstance";
import {
  ensureArray,
  safeMap,
  safeForEach,
  safeIncludes,
} from "../utils/arraySafety";

// Menggunakan konstanta dari axiosInstance.ts

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

  // Filter / sort - Main filter state (applied)
  const [filter, setFilter] = useState({
    category: params.getAll("category") || [],
    brand: params.getAll("brand") || [],
    subcategory: params.getAll("subcategory") || [],
    available: params.getAll("available") || [],
    q: params.get("q") || "",
  });

  // Temporary filter state for user input (before apply)
  const [tempFilter, setTempFilter] = useState(filter);
  const [priceRange, setPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [tempPriceRange, setTempPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);

  // Check if "bundling" category is selected using safe includes
  const isBundlingMode = safeIncludes(filter.category, "bundling");
  const [sort, setSort] = useState(params.get("sort") || "name");
  const [order, setOrder] = useState<"asc" | "desc">(
    (params.get("order") as "asc" | "desc") || "asc"
  );

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

  // Options for react-select using array safety utilities
  const categoryOptions = safeMap<Category, { label: string; value: string }>(
    categories,
    (c) => ({
      label: c.name,
      value: c.slug,
    })
  );
  const brandOptions = safeMap<Brand, { label: string; value: string }>(
    brands,
    (b) => ({ label: b.name, value: b.slug })
  );
  const subCategoryOptions = safeMap<
    SubCategory,
    { label: string; value: string }
  >(subCategories, (s) => ({
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

  // Build params helper using array safety utilities
  const buildParams = useCallback(
    (
      p: number = 1,
      customFilter?: typeof filter,
      customPriceRange?: typeof priceRange
    ) => {
      const currentFilter = customFilter || filter;
      const currentPriceRange = customPriceRange || priceRange;

      const ps = new URLSearchParams();
      if (currentFilter.q) ps.set("q", currentFilter.q);
      // Use safe array operations
      safeForEach(currentFilter.category, (c: string) =>
        ps.append("category", c)
      );
      safeForEach(currentFilter.brand, (b: string) => ps.append("brand", b));
      safeForEach(currentFilter.subcategory, (s: string) =>
        ps.append("subcategory", s)
      );
      safeForEach(currentFilter.available, (a: string) =>
        ps.append("available", a)
      );

      // Only add if priceRange is set and values are valid
      if (
        currentPriceRange &&
        typeof currentPriceRange.min === "number" &&
        !isNaN(currentPriceRange.min)
      ) {
        ps.set("price_min", String(currentPriceRange.min));
      }
      if (
        currentPriceRange &&
        typeof currentPriceRange.max === "number" &&
        !isNaN(currentPriceRange.max)
      ) {
        ps.set("price_max", String(currentPriceRange.max));
      }

      if (sort && sort !== "name") ps.set("sort", sort);
      if (order && !["recommended", "latest", "availability"].includes(sort)) {
        if (order !== "asc") ps.set("order", order);
      }

      // Exclude products that are rental includes of other products
      ps.set("exclude_rental_includes", "true");
      
      // Enable OR logic for cross-category filtering
      // If user selects multiple different filter types (category + brand + subcategory)
      // use OR logic instead of AND
      const hasMultipleFilterTypes = [
        currentFilter.category?.length > 0,
        currentFilter.brand?.length > 0,
        currentFilter.subcategory?.length > 0,
      ].filter(Boolean).length > 1;
      
      if (hasMultipleFilterTypes) {
        ps.set("filter_logic", "or");
        console.log('🔄 Using OR logic for cross-category filtering');
      } else {
        ps.set("filter_logic", "and");
        console.log('🔄 Using AND logic for single filter type');
      }

      ps.set("page", String(p));
      ps.set("limit", String(pageSize));
      
      // Enhanced logging for debugging
      console.log('🔍 Filter params being sent:', {
        categories: currentFilter.category,
        brands: currentFilter.brand,
        subcategories: currentFilter.subcategory,
        available: currentFilter.available,
        priceRange: currentPriceRange,
        filterLogic: hasMultipleFilterTypes ? 'OR' : 'AND',
        query: currentFilter.q,
        sort: sort,
        order: order
      });
      
      return ps;
    },
    [filter, priceRange, sort, order, pageSize]
  );
  // Sync URL params with state when location changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setFilter({
      category: urlParams.getAll("category") || [],
      brand: urlParams.getAll("brand") || [],
      subcategory: urlParams.getAll("subcategory") || [],
      available: urlParams.getAll("available") || [],
      q: urlParams.get("q") || "",
    });
    setSort(urlParams.get("sort") || "name");
    setOrder((urlParams.get("order") as "asc" | "desc") || "asc");
    setPage(Number(urlParams.get("page") || 1));
    setPageSize(Number(urlParams.get("limit") || 10));
  }, [location.search]);

  // Fetch static lists once
  useEffect(() => {
    console.log('🔄 Fetching static lists (categories, brands, sub-categories)...');
    
    Promise.all([
      axiosInstance.get(`/categories`),
      axiosInstance.get(`/brands`),
      axiosInstance.get(`/sub-categories`),
    ])
      .then((responses) => {
        console.log('✅ Static lists responses received:', responses);
        
        // Handle categories
        const categoriesData = responses[0].data.data || responses[0].data || [];
        setCategories(categoriesData);
        console.log(`📦 Loaded ${categoriesData.length} categories`);
        
        // Handle brands
        const brandsData = responses[1].data.data || responses[1].data || [];
        setBrands(brandsData);
        console.log(`📦 Loaded ${brandsData.length} brands`);
        
        // Handle sub-categories
        const subCategoriesData = responses[2].data.data || responses[2].data || [];
        setSubCategories(subCategoriesData);
        console.log(`📦 Loaded ${subCategoriesData.length} sub-categories`);
      })
      .catch((e) => {
        console.error('❌ Static list fetch error:', e);
        const errorMessage = (e as any).errorMessage || e.message || 'Gagal memuat data kategori, brand, dan sub-kategori';
        setError(errorMessage);
        
        // Set empty arrays as fallback
        setCategories([]);
        setBrands([]);
        setSubCategories([]);
      });
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

        const res = await axiosInstance.get(`/bundlings`, {
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

        const res = await axiosInstance.get(`/products`, {
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

  // Initial load and when filter/sort/pageSize changes (only applied filters)
  useEffect(() => {
    // Update URL params
    const sp = buildParams(1);
    navigate({ search: sp.toString() }, { replace: true });

    // Fetch data based on current mode
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

  // Apply temp filters to main filters
  const applyTempFilter = () => {
    setFilter(tempFilter);
    setPriceRange(tempPriceRange);
    setDrawerOpen(false);
  };

  // Reset all filters
  const resetFilters = () => {
    const newFilter = {
      category: [] as string[],
      brand: [] as string[],
      subcategory: [] as string[],
      available: [] as string[],
      q: "",
    };
    setFilter(newFilter);
    setTempFilter(newFilter);
    setPriceRange(null);
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

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="bg-white">
      <NavCard />

      {/* Mobile filter dialog */}
      <MobileFilterDialog
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        tempFilter={tempFilter}
        setTempFilter={setTempFilter}
        tempPriceRange={tempPriceRange}
        setTempPriceRange={setTempPriceRange}
        priceBounds={priceBounds}
        categoryOptions={categoryOptions}
        brandOptions={brandOptions}
        subCategoryOptions={subCategoryOptions}
        onApply={applyTempFilter}
        onReset={resetFilters}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mt-2">
            {isBundlingMode ? "Daftar Bundling Kami" : "Daftar Produk Kami"}
          </h1>

          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                Urutkan
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
              >
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value}>
                      {({ focus }) => (
                        <button
                          onClick={() => updateSort(option.value)}
                          className={classNames(
                            (sort === "recommended"
                              ? "recommended"
                              : `${sort}_${order}`) === option.value
                              ? "font-medium text-gray-900"
                              : "text-gray-500",
                            "block px-4 py-2 text-sm w-full text-left",
                            focus ? "bg-gray-100" : ""
                          )}
                        >
                          {option.label}
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
            >
              <span className="sr-only">Filters</span>
              <FunnelIcon aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Desktop Filters */}
            <DesktopFilterSidebar
              tempFilter={tempFilter}
              setTempFilter={setTempFilter}
              tempPriceRange={tempPriceRange}
              setTempPriceRange={setTempPriceRange}
              priceRange={priceRange}
              priceBounds={priceBounds}
              categoryOptions={categoryOptions}
              brandOptions={brandOptions}
              subCategoryOptions={subCategoryOptions}
              onApply={applyTempFilter}
              onReset={resetFilters}
            />

            {/* Product grid */}
            <div className="lg:col-span-3">
              {/* Active Filters Display for Desktop */}
              <div className="hidden lg:block">
                <FilterHeader
                  currentFilters={filter}
                  priceRange={priceRange}
                  onClearAll={resetFilters}
                  onClearCategory={(value) => {
                    setFilter((prev) => ({
                      ...prev,
                      category: prev.category.filter((c) => c !== value),
                    }));
                  }}
                  onClearBrand={(value) => {
                    setFilter((prev) => ({
                      ...prev,
                      brand: prev.brand.filter((b) => b !== value),
                    }));
                  }}
                  onClearSubcategory={(value) => {
                    setFilter((prev) => ({
                      ...prev,
                      subcategory: prev.subcategory.filter((s) => s !== value),
                    }));
                  }}
                  onClearAvailable={(value) => {
                    setFilter((prev) => ({
                      ...prev,
                      available: prev.available.filter((a) => a !== value),
                    }));
                  }}
                  onClearPrice={() => {
                    setPriceRange(null);
                  }}
                  onClearSearch={() => {
                    setFilter((prev) => ({ ...prev, q: "" }));
                  }}
                  categoryOptions={categoryOptions}
                  brandOptions={brandOptions}
                  subCategoryOptions={subCategoryOptions}
                />
              </div>

              {/* Page size selector */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <label className="mr-2">Tampilkan:</label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span>produk per halaman</span>
                </div>
              </div>

              {error && (
                <div className="mb-6 rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : isBundlingMode ? (
                bundlings.length === 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <BundlingCardSkeleton key={`bundling-empty-${i}`} />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                      {bundlings.map((bundling) => (
                        <Link
                          key={bundling.id}
                          to={`/bundling/${bundling.slug}`}
                          className="group"
                        >
                          <BundlingCard bundling={bundling} />
                        </Link>
                      ))}
                    </div>

                    {hasMore && (
                      <div className="mt-8 flex justify-center">
                        <button
                          onClick={loadMore}
                          disabled={loadingMore}
                          className="rounded-md bg-text-light-primary px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {loadingMore ? "Loading..." : "Load More"}
                        </button>
                      </div>
                    )}
                  </>
                )
              ) : products.length === 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={`product-empty-${i}`} />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {products.map((product, index) => (
                      <EnhancedProductCard 
                        key={product.id}
                        product={product}
                        variant="grid"
                      />
                    ))}
                  </div>

                  {hasMore && (
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="rounded-md bg-text-light-primary px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loadingMore ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
