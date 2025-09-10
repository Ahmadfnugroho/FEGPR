import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import NavCard from "../components/navCard";
import { useParams, Link } from "react-router-dom";
import {
  MdArrowBack,
} from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { STORAGE_BASE_URL } from "../api/constants";
import axiosInstance from "../api/axiosInstance";
import type {
  Bundling,
  BundlingProduct,
  ProductPhoto,
  BundlingPhoto,
  productSpecification,
  RentalInclude,
} from "../types/type";
import AnimatedPulseBorder from "../components/AnimatedPulseBorder";
import EnhancedBookingForm from "../components/EnhancedBookingForm";
import { formatPrice } from "../utils/rental-duration-helper";
import { MainLayout } from "../components/Layout";
import {
  isBundlingAvailable,
  getBundlingAvailableQuantity,
  getBundlingAvailabilityText,
  isProductAvailable
} from "../utils/availabilityUtils";
import { useBookingDatesContext } from "../contexts/BookingDatesContext";
import { useDebouncedBookingDates } from "../hooks/useDebounce";

// TypeScript interfaces for better type safety
interface ExpandedSpecsState {
  [key: number]: boolean;
}

interface BundlingAvailability {
  isAvailable: boolean;
  availableQuantity: number;
  unavailableProducts: BundlingProduct[];
  text: string;
}

type PhotoWithProductName = (ProductPhoto | BundlingPhoto) & {
  productName: string;
};

// API fetch function with proper error handling and typing
const fetchBundling = async (
  slug: string | undefined, 
  startDate?: string, 
  endDate?: string
): Promise<Bundling> => {
  if (!slug) {
    throw new Error("No slug provided");
  }
  
  try {
    const params: Record<string, string> = {};
    if (startDate && endDate) {
      params.start_date = startDate;
      params.end_date = endDate;
    }
    
    const { data } = await axiosInstance.get(`/bundling/${slug}`, {
      params,
      timeout: 10000
    });
    
    if (!data?.data) {
      throw new Error("Bundling tidak ditemukan");
    }
    
    return data.data as Bundling;
  } catch (error) {
    console.error('❌ Error fetching bundling:', error);
    throw error;
  }
};

export default function BundlingDetails(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  
  // Component state with proper TypeScript typing
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [expandedSpecs, setExpandedSpecs] = useState<ExpandedSpecsState>({});
  const [isLoadingAvailability, setIsLoadingAvailability] = useState<boolean>(false);
  
  // Global persistent date management using context
  const {
    startDate,
    endDate,
    dateRange: bookingDateRange,
    setDates: setBookingDates,
    isDateRangeValid,
    areDatesSelected,
    formattedDateRange,
    updateCount,
    lastUpdateTime
  } = useBookingDatesContext();
  
  // Debug logging for date state in BundlingDetails component
  useEffect((): void => {
    try {
      console.log('📦 BundlingDetails.tsx: Date state from context:', {
        startDate,
        endDate,
        dateRange: {
          startDate: bookingDateRange.startDate?.toISOString(),
          endDate: bookingDateRange.endDate?.toISOString()
        },
        isDateRangeValid,
        areDatesSelected,
        formattedDateRange,
        updateCount,
        lastUpdateTime,
        component: 'BundlingDetails.tsx',
        source: 'context_state_debug'
      });
    } catch (error) {
      console.error('❌ Error in date state debug logging:', error);
    }
  }, [startDate, endDate, bookingDateRange, isDateRangeValid, areDatesSelected, formattedDateRange, updateCount, lastUpdateTime]);
  

  // Debounce date changes to prevent excessive API calls
  // Only fetch when both dates are selected and stable for 1 second
  const { debouncedStartDate, debouncedEndDate } = useDebouncedBookingDates(
    startDate,
    endDate,
    1000 // 1 second delay
  );
  
  // Only use debounced dates for API calls when both dates are present
  const shouldFetchWithDates = !!(debouncedStartDate && debouncedEndDate && areDatesSelected);
  const apiStartDate = shouldFetchWithDates ? debouncedStartDate : undefined;
  const apiEndDate = shouldFetchWithDates ? debouncedEndDate : undefined;
  
  // Debug logging for React Query parameters
  useEffect((): void => {
    try {
      console.log('🔍 BundlingDetails.tsx: React Query parameters:', {
        queryKey: ["bundling", slug, apiStartDate, apiEndDate],
        slug,
        originalDates: { startDate, endDate },
        debouncedDates: { debouncedStartDate, debouncedEndDate },
        apiDates: { apiStartDate, apiEndDate },
        shouldFetchWithDates,
        areDatesSelected,
        enabled: !!slug,
        source: 'react_query_debug'
      });
    } catch (error) {
      console.error('❌ Error in React Query debug logging:', error);
    }
  }, [slug, startDate, endDate, debouncedStartDate, debouncedEndDate, apiStartDate, apiEndDate, shouldFetchWithDates, areDatesSelected]);

  const {
    data: bundling,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Bundling, Error>({
    queryKey: ["bundling", slug, apiStartDate, apiEndDate],
    queryFn: () => {
      console.log('🌐 BundlingDetails.tsx: Executing fetchBundling with params:', {
        slug,
        startDate: apiStartDate,
        endDate: apiEndDate,
        source: 'fetchBundling_call'
      });
      return fetchBundling(slug, apiStartDate, apiEndDate);
    },
    enabled: !!slug, // Only run when slug exists - dates are optional
  });
  
  // Monitor React Query state changes
  useEffect((): void => {
    try {
      if (bundling) {
        console.log('✅ BundlingDetails.tsx: React Query success:', {
          bundlingName: bundling.name,
          apiParams: { startDate: apiStartDate, endDate: apiEndDate },
          originalDates: { startDate, endDate },
          contextState: {
            contextStartDate: startDate,
            contextEndDate: endDate,
            updateCount,
            areDatesSelected
          },
          source: 'react_query_success'
        });
        
        // Verify context state hasn't been corrupted
        if (areDatesSelected) {
          console.log('✅ BundlingDetails.tsx: Date state preserved after React Query success');
        }
      }
      
      if (isError && error) {
        console.error('❌ BundlingDetails.tsx: React Query error:', {
          error: error.message,
          apiParams: { startDate: apiStartDate, endDate: apiEndDate },
          originalDates: { startDate, endDate },
          contextState: {
            contextStartDate: startDate,
            contextEndDate: endDate,
            updateCount,
            areDatesSelected
          },
          source: 'react_query_error'
        });
      }
      
      // Log settled state
      if (!isLoading) {
        console.log('🏁 BundlingDetails.tsx: React Query settled:', {
          hasData: !!bundling,
          hasError: isError,
          finalDateParams: { startDate, endDate },
          contextPreserved: {
            startDate,
            endDate,
            areDatesSelected,
            updateCount
          },
          source: 'react_query_settled'
        });
      }
    } catch (error) {
      console.error('❌ Error in React Query state monitoring:', error);
    }
  }, [bundling, isError, error, isLoading, startDate, endDate, areDatesSelected, updateCount]);

  // Computed values with proper TypeScript typing
  const allPhotos: PhotoWithProductName[] = useMemo(() => {
    if (!bundling) return [];
    const photos: ((ProductPhoto | BundlingPhoto) & { productName: string })[] =
      [];

    // First priority: Add bundling photos
    if (bundling.bundlingPhotos && bundling.bundlingPhotos.length > 0) {
      bundling.bundlingPhotos.forEach((photo) => {
        photos.push({
          ...photo,
          productName: bundling.name + " (Bundling)",
        });
      });
    }

    // Then add product photos as additional images
    bundling.products.forEach((product) => {
      product.productPhotos?.forEach((photo) => {
        photos.push({
          ...photo,
          productName: product.name,
        });
      });
    });

    return photos;
  }, [bundling]);

  // WhatsApp link with bundling and quantity info
  const whatsappLink: string = useMemo(() => {
    if (!bundling) return "";
    const message: string = `Halo, saya tertarik untuk menyewa bundling ${bundling.name} sebanyak ${quantity} paket. Bisa beri info lebih lanjut?`;
    return `https://wa.me/6281212349564?text=${encodeURIComponent(message)}`;
  }, [bundling, quantity]);

  // Calculate bundling availability using proper utils
  const bundlingAvailability: BundlingAvailability = useMemo(() => {
    if (!bundling) return { isAvailable: false, availableQuantity: 0, unavailableProducts: [], text: 'Tidak tersedia' };
    
    const isAvailable = isBundlingAvailable(bundling);
    const availableQuantity = getBundlingAvailableQuantity(bundling);
    const availabilityText = getBundlingAvailabilityText(bundling);
    
    // Find products that are not available
    const unavailableProducts = bundling.products.filter(
      (product) => !isProductAvailable(product)
    );
    
    console.log('📦 Bundling availability calculated:', {
      bundling: bundling.name,
      isAvailable,
      availableQuantity,
      unavailableCount: unavailableProducts.length,
      period: startDate && endDate 
        ? `${startDate} - ${endDate}` 
        : 'no dates selected'
    });
    
    return {
      isAvailable,
      availableQuantity,
      unavailableProducts,
      text: availabilityText.text
    };
  }, [bundling, startDate, endDate]);

  // State for updated availability from form submission
  const [currentAvailability, setCurrentAvailability] = useState<{ isAvailable: boolean; quantity: number } | null>(null);
  
  // Extract values for easier access - use updated availability if available
  const isAvailable = currentAvailability?.isAvailable ?? bundlingAvailability.isAvailable;
  const availableQuantity = currentAvailability?.quantity ?? bundlingAvailability.availableQuantity;
  const unavailableProducts = bundlingAvailability.unavailableProducts;

  const formattedPrice: string = useMemo(() => {
    if (!bundling) return "";
    return formatPrice(bundling.price);
  }, [bundling]);

  const handleQuantityChange = useCallback((delta: number): void => {
    setQuantity((prev: number) => Math.max(1, Math.min(10, prev + delta)));
  }, []);

  if (isError) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <MdArrowBack className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              {error?.message || "Bundling Tidak Ditemukan"}
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => refetch()}
                className="w-full bg-accent hover:bg-accent/80 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Coba Lagi
              </button>
              <Link
                to="/"
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
              >
                <MdArrowBack className="inline mr-2" />
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!bundling) {
    return (
      <MainLayout>
        <NavCard />
        <AnimatedPulseBorder isLoading={true}>
          <div className="bg-gray-50 md:bg-white flex-1">
            <main className="max-w-[640px] md:max-w-[1130px] mx-auto px-4 sm:px-6 pb-8 pt-20 md:pt-28">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* Left column skeleton */}
                <div className="lg:col-span-3 flex flex-col">
                  {/* Image skeleton */}
                  <div className="w-full h-[350px] bg-gray-200 rounded-xl animate-pulse mb-6"></div>

                  {/* Products in bundling skeleton */}
                  <div className="pt-4 border-t border-light">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
                    <div className="space-y-6">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="border border-light rounded-lg p-4 shadow-sm bg-white"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                            </div>
                            <div className="text-right">
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-1"></div>
                              <div className="h-3 bg-gray-200 rounded animate-pulse w-10"></div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-2"></div>
                            <div className="space-y-1">
                              {Array.from({ length: 2 }).map((_, j) => (
                                <div key={j} className="flex items-center">
                                  <div className="w-1 h-1 bg-gray-300 rounded-full mr-2 animate-pulse"></div>
                                  <div className="h-3 bg-gray-200 rounded animate-pulse flex-1"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column skeleton */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>

                  {/* Price */}
                  <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>

                  {/* Controls */}
                  <div className="space-y-4">
                    <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </AnimatedPulseBorder>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <NavCard />
      <AnimatedPulseBorder isLoading={isLoading}>
        <div className="bg-gray-50 md:bg-white flex-1">
          <main className="max-w-[640px] md:max-w-[1130px] mx-auto px-4 sm:px-6 pb-24 md:pb-8 pt-20 md:pt-28 scroll-fade-in">
            {/* Grid: Gambar + Info */}
            <div
              className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start scroll-fade-in"
              data-delay="100"
            >
              {/* Kolom 1: Swiper */}
              <div className="lg:col-span-3 flex flex-col">
                <div
                  className="relative flex flex-col h-full"
                  style={{ minHeight: 0 }}
                >
                  <div
                    className="w-full flex items-start scroll-fade-in"
                    style={{
                      paddingBottom: "24px",
                      transition: "padding 0.3s",
                    }}
                    data-delay="200"
                  >
                    {allPhotos.length > 0 ? (
                      <Swiper
                        modules={[Pagination]}
                        spaceBetween={10}
                        slidesPerView={1}
                        loop={allPhotos.length > 2}
                        pagination={{ clickable: true }}
                        className="rounded-xl overflow-hidden shadow-lg w-full"
                        style={{
                          maxHeight: "350px",
                          transition: "max-height 0.3s",
                        }}
                      >
                        {allPhotos.map((photo, index) => (
                          <SwiperSlide key={`${photo.id}-${index}`}>
                            <div
                              className="w-full flex items-start justify-center bg-light overflow-hidden"
                              style={{
                                maxHeight: "350px",
                                minHeight: "200px",
                                transition: "max-height 0.3s",
                              }}
                            >
                              <img
                                src={`${STORAGE_BASE_URL}/${photo.photo}`}
                                alt={`Foto ${photo.productName}`}
                                className="object-contain max-h-[350px] w-auto h-auto transition-all duration-300"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "350px",
                                  minHeight: "200px",
                                }}
                                loading="lazy"
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <div className="w-full h-[300px] bg-gray-200 rounded-xl animate-pulse"></div>
                    )}
                  </div>

                  {/* Produk dalam Bundling */}
                  <div
                    className="pt-4 border-t border-light scroll-fade-in"
                    data-delay="300"
                  >
                    <h2
                      className="font-bold text-lg mb-4 scroll-fade-in"
                      data-delay="400"
                    >
                      Produk dalam Paket
                    </h2>
                    <div
                      className="space-y-6 stagger-fade-in"
                      data-staggerdelay="100"
                    >
                      {bundling.products.map(
                        (product: BundlingProduct, index) => (
                          <div
                            key={product.id}
                            className="border border-light rounded-lg p-4 stagger-item shadow-sm bg-white"
                            data-index={index}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-semibold text-lg text-dark">
                                  {product.quantity > 1 &&
                                    `${product.quantity}x `}
                                  {product.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-muted">
                                  {product.category && (
                                    <span>{product.category.name}</span>
                                  )}
                                  {product.brand && (
                                    <>
                                      <span>•</span>
                                      <span>{product.brand.name}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-primary">
                                  {formatPrice(product.price)}
                                </p>
                                <p className="text-xs text-muted">/hari</p>
                              </div>
                            </div>

                            {/* Rental Includes for this product */}
                            <div className="mt-3">
                              <h4 className="font-medium text-sm mb-2">
                                Termasuk:
                              </h4>
                              <div className="space-y-1">
                                {product.rentalIncludes &&
                                product.rentalIncludes.length > 0 ? (
                                  product.rentalIncludes.map(
                                    (include: RentalInclude) => (
                                      <div
                                        key={include.id}
                                        className="flex items-center text-xs text-muted"
                                      >
                                        <span className="w-1 h-1 bg-secondary-light rounded-full mr-2"></span>
                                        <span>
                                          {include.quantity &&
                                            parseInt(include.quantity) > 1 &&
                                            `${include.quantity}x `}
                                          {include.included_product?.name ||
                                            "Item tidak diketahui"}
                                        </span>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <div className="flex items-center text-xs text-muted">
                                    <span className="w-1 h-1 bg-secondary-light rounded-full mr-2"></span>
                                    <span>{product.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Product Specifications */}
                            {product.productSpecifications &&
                              product.productSpecifications.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-light">
                                  <h4 className="font-medium text-sm mb-2">
                                    Spesifikasi:
                                  </h4>
                                  <div className="text-xs text-muted">
                                    {product.productSpecifications[0]?.name
                                      ?.split("\n")
                                      .slice(
                                        0,
                                        expandedSpecs[product.id]
                                          ? undefined
                                          : 3
                                      )
                                      .map((line, i) => (
                                        <p key={i} className="truncate">
                                          {line.trim()}
                                        </p>
                                      ))}
                                  </div>
                                  {product.productSpecifications[0]?.name?.split(
                                    "\n"
                                  ).length > 3 && (
                                    <button
                                      onClick={() =>
                                        setExpandedSpecs((prev) => ({
                                          ...prev,
                                          [product.id]: !prev[product.id],
                                        }))
                                      }
                                      className="mt-2 text-primary text-xs font-medium hover:underline"
                                    >
                                      {expandedSpecs[product.id]
                                        ? "Lihat lebih sedikit"
                                        : "Lihat lebih banyak"}
                                    </button>
                                  )}
                                </div>
                              )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom 2: Info Bundling */}
              <div className="lg:col-span-2 space-y-6 scroll-fade-in" data-delay="200">
                {/* Availability Status */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isAvailable
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                    role="status"
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        isAvailable ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {isAvailable ? `Tersedia (${availableQuantity} paket)` : "Tidak Tersedia"}
                  </span>
                </div>

                {/* Product Title and Info */}
                <header className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block rounded-full px-3 py-1 font-bold text-sm text-center text-white bg-text-light-primary">
                      📦 Bundling Package
                    </span>
                    {bundling.premiere && (
                      <span className="inline-block rounded-full px-2 py-1 font-semibold text-xs text-white bg-amber-500">
                        ⭐ Rekomendasi
                      </span>
                    )}
                  </div>
                  
                  <h1 className="font-bold text-2xl lg:text-3xl text-gray-900 leading-tight">
                    {bundling.name}
                  </h1>
                  
                  <p className="text-lg text-gray-600">
                    {bundling.products.length} produk dalam paket
                  </p>
                </header>

                {/* Price Display */}
                <div className="bg-gray-50 rounded-xl p-6 border">
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {formatPrice(bundling.price)}
                    <span className="text-lg font-normal text-gray-600 ml-1">
                      /hari
                    </span>
                  </p>
                  <div className="text-sm text-gray-600 mt-2">
                    <p className="mb-1">💰 Hemat dibanding sewa terpisah:</p>
                    <p className="font-semibold text-green-600">
                      {formatPrice(
                        bundling.products.reduce(
                          (total, product) =>
                            total + product.price * product.quantity,
                          0
                        ) - bundling.price
                      )}
                    </p>
                  </div>
                </div>

                {/* Unavailable Products Warning */}
                {!isAvailable && unavailableProducts.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
                          <span className="text-white text-xs font-bold">!</span>
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-red-800 mb-1">
                          Produk tidak tersedia:
                        </h4>
                        <ul className="text-xs text-red-700 space-y-1">
                          {unavailableProducts.map((product) => (
                            <li key={product.id} className="flex items-center">
                              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                              {product.quantity > 1 && `${product.quantity}x `}
                              {product.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Booking Form */}
                <EnhancedBookingForm
                  item={bundling}
                  type="bundling"
                  isLoadingAvailability={isLoading || isLoadingAvailability}
                  isAvailable={isAvailable}
                  availableQuantity={availableQuantity}
                  onAvailabilityUpdate={(newIsAvailable, newAvailableQuantity) => {
                    console.log('🔄 BundlingDetails: Updating availability from form submission:', {
                      newIsAvailable,
                      newAvailableQuantity,
                      source: 'form_callback'
                    });
                    setCurrentAvailability({
                      isAvailable: newIsAvailable,
                      quantity: newAvailableQuantity
                    });
                  }}
                />
              </div>
            </div>
            
            {/* Additional Information Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start mt-8">
              {/* Empty space for columns 1-3 */}
              <div className="lg:col-span-3 hidden lg:block"></div>
              
              {/* Bundling Benefits in columns 4-5 */}
              <div className="lg:col-span-2">
                <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                    <h2 className="font-semibold text-xl text-gray-900 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Keuntungan Bundling:
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Hemat Biaya</p>
                          <p className="text-sm text-gray-600">Lebih murah dibanding sewa produk terpisah</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Satu Paket Lengkap</p>
                          <p className="text-sm text-gray-600">Semua peralatan sudah disesuaikan satu sama lain</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Proses Mudah</p>
                          <p className="text-sm text-gray-600">Satu kali booking untuk semua kebutuhan</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-blue-900">Informasi Penting</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Semua produk dalam bundling sudah dicek kompatibilitasnya. Peralatan akan dikirim dalam kondisi siap pakai dan sudah dikalibrasi.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </AnimatedPulseBorder>
      
      {/* Mobile Bottom Action Bar - positioned above footer */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30 md:hidden">
        <div className="max-w-[640px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between space-x-3">
            {/* Price Info */}
            <div className="flex-1">
              <div className="text-lg font-bold text-gray-900">
                {formattedPrice}
                <span className="text-sm font-normal text-gray-600 ml-1">
                  /hari
                </span>
              </div>
              <div className="text-xs text-green-600">
                💰 Hemat {formatPrice(
                  bundling.products.reduce(
                    (total, product) => total + product.price * product.quantity,
                    0
                  ) - bundling.price
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center space-x-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 ${
                  isAvailable
                    ? "bg-text-light-primary hover:bg-blue-700 text-white shadow-md"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
                {...(!isAvailable && { "aria-disabled": "true" })}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
                {isAvailable ? "Sewa Bundling" : "Tidak Tersedia"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
