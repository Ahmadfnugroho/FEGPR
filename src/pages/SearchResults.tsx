// src/pages/SearchResults.tsx
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAdvancedSearch } from "../hooks/useAdvancedSearch";
import { SearchFilters } from "../utils/searchUtils";
import { STORAGE_BASE_URL } from "../api/constants";
import { highlightMatches } from "../utils/searchUtils";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category");
  const brandParam = searchParams.get("brand");
  const typeParam = searchParams.get("type");

  // Initialize filters from URL params
  const [filters, setFilters] = useState<SearchFilters>(() => {
    const initialFilters: SearchFilters = {};

    if (categoryParam) {
      initialFilters.category = categoryParam.split(",");
    }
    if (brandParam) {
      initialFilters.brand = brandParam.split(",");
    }
    if (typeParam) {
      initialFilters.type = typeParam.split(",") as ("product" | "bundling")[];
    }

    return initialFilters;
  });

  const {
    searchResults,
    totalResults,
    isSearching,
    setQuery,
    setFilters: updateFilters,
    error,
  } = useAdvancedSearch({
    initialQuery: query,
    initialFilters: filters,
    debounceMs: 200,
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    if (filters.category && filters.category.length > 0) {
      params.set("category", filters.category.join(","));
    } else {
      params.delete("category");
    }

    if (filters.brand && filters.brand.length > 0) {
      params.set("brand", filters.brand.join(","));
    } else {
      params.delete("brand");
    }

    if (filters.type && filters.type.length > 0) {
      params.set("type", filters.type.join(","));
    } else {
      params.delete("type");
    }

    setSearchParams(params, { replace: true });
  }, [filters, query, setSearchParams, searchParams]);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  const clearAllFilters = () => {
    const newFilters = {};
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const activeFilterCount = Object.values(filters).reduce((count, filter) => {
    return count + (Array.isArray(filter) ? filter.length : 0);
  }, 0);

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Mulai Pencarian Anda
          </h2>
          <p className="text-gray-600">
            Masukkan kata kunci untuk mencari produk atau bundling.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hasil Pencarian
              </h1>
              {query && (
                <p className="text-gray-600 mt-1">
                  Menampilkan {totalResults} hasil untuk "
                  <span className="font-medium">{query}</span>"
                </p>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                showFilters
                  ? "bg-blue-50 text-blue-700 border-blue-300"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FunnelIcon className="h-5 w-5" />
              Filter
              {activeFilterCount > 0 && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:col-span-1 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-medium text-gray-900">Filter</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Hapus Semua
                  </button>
                )}
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Tipe</h4>
                <div className="space-y-2">
                  {[
                    { value: "product", label: "Produk" },
                    { value: "bundling", label: "Bundling" },
                  ].map(({ value, label }) => (
                    <label key={value} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={
                          filters.type?.includes(
                            value as "product" | "bundling"
                          ) || false
                        }
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [
                                ...(filters.type || []),
                                value as "product" | "bundling",
                              ]
                            : (filters.type || []).filter((t) => t !== value);
                          handleFilterChange({ ...filters, type: newTypes });
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              {activeFilterCount > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Filter Aktif
                  </h4>
                  <div className="space-y-2">
                    {filters.type?.map((type) => (
                      <div
                        key={type}
                        className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg"
                      >
                        <span className="text-sm text-blue-800">
                          {type === "product" ? "Produk" : "Bundling"}
                        </span>
                        <button
                          onClick={() => {
                            const newTypes = (filters.type || []).filter(
                              (t) => t !== type
                            );
                            handleFilterChange({ ...filters, type: newTypes });
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {isSearching && (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
                <span className="ml-3 text-gray-600">Mencari...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 text-red-600 hover:text-red-800 font-medium"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {/* No Results */}
            {!isSearching && !error && totalResults === 0 && query && (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xs font-medium text-gray-900 mb-2">
                  Tidak ada hasil ditemukan
                </h3>
                <p className="text-gray-600 mb-4">
                  Coba kata kunci yang berbeda atau hapus beberapa filter.
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Hapus Semua Filter
                  </button>
                )}
              </div>
            )}

            {/* Results Grid */}
            {!isSearching && searchResults.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((item) => (
                  <Link
                    key={`${item.type}-${item.id}`}
                    to={item.url}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
                  >
                    {/* Image */}
                    <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                      {item.thumbnail ? (
                        <img
                          src={`${STORAGE_BASE_URL}/${item.thumbnail}`}
                          alt={item.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                          <span className="text-4xl">
                            {item.type === "bundling" ? "📦" : "📷"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Type Badge */}
                      <div className="mb-2">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === "product"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.type === "product" ? "Produk" : "Bundling"}
                        </span>
                      </div>

                      {/* Name with highlighting */}
                      <h3
                        className="text-xs font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatches(item.name, query),
                        }}
                      />

                      {/* Category and Brand */}
                      <div className="flex items-center text-sm text-gray-500 mb-3 gap-2">
                        {item.category && <span>{item.category.name}</span>}
                        {item.category && item.brand && <span>•</span>}
                        {item.brand && <span>{item.brand.name}</span>}
                      </div>

                      {/* Price */}
                      {item.price && (
                        <div className="text-xs font-bold text-blue-600">
                          {formatPrice(item.price)}
                        </div>
                      )}

                      {/* Match Score (dev only) */}
                      {import.meta.env.DEV && (
                        <div className="mt-2 text-xs text-gray-400">
                          Score: {Math.round(item.score * 100)}% | Matched:{" "}
                          {item.matchedFields.join(", ")}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
