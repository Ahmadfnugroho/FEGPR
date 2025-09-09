import { useMemo, useCallback, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight } from "lucide-react";

import {
  MdOutlineCamera,
  MdArrowBack,
  MdError,
  MdStar,
  MdLocationOn,
  MdFavorite,
  MdShoppingCart,
  MdAdd,
  MdRemove,
} from "react-icons/md";
import { STORAGE_BASE_URL } from "../api/constants";
import axiosInstance from "../api/axiosInstance";
import BottomNavigation from "../components/BottomNavigation";

import type {
  Product,
  ProductPhoto,
  productSpecification,
  RentalInclude,
} from "../types/type";

import NavCard from "../components/navCard";
import { MainLayout } from "../components/Layout";
import PageSkeleton from "../components/PageSkeleton";
import EnhancedSEOHead, { useProductSEO } from "../components/EnhancedSEOHead";
import EnhancedBookingForm from "../components/EnhancedBookingForm";
import { 
  isProductAvailable, 
  getProductAvailableQuantity, 
  getProductAvailabilityText 
} from "../utils/availabilityUtils";
import { useBookingDatesContext } from "../contexts/BookingDatesContext";
import { useDebouncedBookingDates } from "../hooks/useDebounce";

// Constants
// Menggunakan API_BASE_URL dari axiosInstance
const WHATSAPP_NUMBER = "6281212349564";

// --- API HELPER ---
const fetchProduct = async (slug: string | undefined, startDate?: string, endDate?: string): Promise<Product> => {
  if (!slug) throw new Error("Slug produk tidak ditemukan");

  const params: any = {};
  if (startDate && endDate) {
    params.start_date = startDate;
    params.end_date = endDate;
  }

  const { data } = await axiosInstance.get<{ data: Product }>(
    `/product/${slug}`,
    { 
      params,
      timeout: 10000 
    }
  );

  if (!data?.data) throw new Error("Produk tidak ditemukan");
  return data.data;
};

// --- SUB COMPONENTS ---
const ProductImageGallery = ({
  productName,
  photos,
}: {
  productName: string;
  photos: ProductPhoto[];
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.src = "/assets/images/placeholder.jpg";
    },
    []
  );

  if (!photos?.length) {
    return (
      <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl bg-gray-100 flex items-center justify-center shadow-sm border">
        <div className="text-center">
          <MdError className="w-16 h-16 text-gray-400 mx-auto mb-3" />
          <span className="text-gray-500 text-lg">
            Tidak ada gambar tersedia
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="w-full h-[400px] md:h-[500px] lg:h-80 bg-white rounded-xl shadow-sm border overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          spaceBetween={0}
          slidesPerView={1}
          loop={photos.length > 1}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="w-full h-full"
          aria-label={`Galeri foto ${productName}`}
        >
          {photos.map((photo, index) => (
            <SwiperSlide key={photo.id}>
              <div className="w-200 h-full flex items-center justify-center bg-gray-50 p-4">
                <img
                  src={`${STORAGE_BASE_URL}/${photo.photo}`}
                  alt={`Foto ${productName} ${index + 1}`}
                  className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                  loading={index <= 2 ? "eager" : "lazy"}
                  onError={handleImageError}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        {photos.length > 1 && <></>}
      </div>

      {/* Thumbnail Navigation */}
      {photos.length > 1 && (
        <div className="w-5/12 ">
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={12}
            slidesPerView={4}
            breakpoints={{
              640: { slidesPerView: 5 },
              768: { slidesPerView: 6 },
              1024: { slidesPerView: 4 },
            }}
            watchSlidesProgress
            className="thumbnail-swiper"
          >
            {photos.map((photo, index) => (
              <SwiperSlide key={`thumb-${photo.id}`}>
                <div
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                    index === activeIndex
                      ? "border-text-light-primary shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <img
                    src={`${STORAGE_BASE_URL}/${photo.photo}`}
                    alt={`Thumbnail ${productName} ${index + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-200 hover:opacity-80"
                    loading="lazy"
                    onError={handleImageError}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

const ProductInfo = ({ 
  product, 
  isLoadingAvailability = false 
}: { 
  product: Product; 
  isLoadingAvailability?: boolean;
}) => {
  const categoryItems = useMemo(
    () =>
      [product.category, product.subCategory, product.brand]
        .filter(Boolean)
        .map((item) => item?.name)
        .filter(Boolean),
    [product.category, product.subCategory, product.brand]
  );

  // Use proper availability calculation based on available_quantity + is_available
  const availabilityInfo = getProductAvailabilityText(product);
  const isAvailable = availabilityInfo.isAvailable;
  const availableQuantity = availabilityInfo.quantity;
  
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Stock Status */}
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
          {isAvailable ? `Tersedia (${availableQuantity} unit)` : "Tidak Tersedia"}
        </span>
      </div>

      {/* Product Title */}
      <header className="space-y-3">
        <h1 className="font-bold text-2xl lg:text-3xl text-gray-900 leading-tight">
          {product.name}
        </h1>

        {categoryItems.length > 0 && (
          <p className="text-lg text-gray-600">{categoryItems.join(" • ")}</p>
        )}
      </header>

      {/* Price Display */}
      <div className="bg-gray-50 rounded-xl p-6 border">
        <p className="text-3xl font-bold text-gray-900 mb-1">
          {formattedPrice}
          <span className="text-lg font-normal text-gray-600 ml-1">
            /hari
          </span>
        </p>
      </div>

      {/* Enhanced Booking Form */}
      <EnhancedBookingForm
        item={product}
        type="product"
        isLoadingAvailability={isLoadingAvailability}
        isAvailable={isAvailable}
        availableQuantity={availableQuantity}
      />
    </div>
  );
};

const ProductSpecifications = ({
  specifications,
}: {
  specifications: productSpecification[];
}) => {
  const [openItems, setOpenItems] = useState<number[]>([]); // simpan id header yang terbuka

  const specLines = useMemo(() => {
    if (!specifications?.length) return [];
    return specifications[0].name
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => ({
        id: index,
        text: line,
        isHeader: line.includes(":") && !line.startsWith("•"),
      }));
  }, [specifications]);

  if (!specLines.length) return null;

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h2 className="font-semibold text-xl text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Spesifikasi Produk
        </h2>
      </div>

      <div className="p-1">
        <dl className="grid grid-cols-1 divide-y">
          {specLines.map((spec, i) => {
            if (spec.isHeader) {
              const isOpen = openItems.includes(spec.id);

              // ambil baris berikutnya (jika ada) sebagai konten
              const nextLine =
                i + 1 < specLines.length && !specLines[i + 1].isHeader
                  ? specLines[i + 1].text
                  : null;

              return (
                <div key={spec.id} className="py-0.5">
                  {/* Header */}
                  <div
                    className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-2 text-sm cursor-pointer"
                    onClick={() => toggleItem(spec.id)}
                  >
                    <span className="font-semibold text-primary text-xs">
                      {spec.text}
                    </span>
                    {isOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </div>

                  {/* Content (muncul hanya kalau open & ada konten) */}
                  {isOpen && nextLine && (
                    <div className="pl-6 mt-2 text-gray-700 text-xs leading-relaxed border-l-2 border-gray-200">
                      {nextLine}
                    </div>
                  )}
                </div>
              );
            }

            // kalau !isHeader (content), tidak dirender langsung
            return null;
          })}
        </dl>
      </div>
    </section>
  );
};

const RentalIncludes = ({
  productName,
  includes,
}: {
  productName: string;
  includes: RentalInclude[];
}) => {
  const includeItems = useMemo(() => {
    if (!includes?.length) {
      return [{ id: "default", name: productName, quantity: 1 }];
    }
    return includes.map((item) => ({
      id: item.id,
      name: item.included_product?.name || "Item tidak diketahui",
      quantity: item.quantity ? parseInt(item.quantity, 10) : 1,
    }));
  }, [includes, productName]);

  return (
    <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h2 className="font-semibold text-xl text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
          Sudah Termasuk:
        </h2>
      </div>

      <div className="p-2">
        <div className="grid grid-cols-1 gap-3">
          {includeItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-3 p-1 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {item.quantity > 1 && (
                    <span className="inline-block bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mr-2">
                      {item.quantity}x
                    </span>
                  )}
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900">Informasi</h4>
              <p className="text-sm text-blue-700 mt-1">
                Semua barang sudah dibersihkan dan dicek dengan baik sebelum
                disewakan. Tolong dijaga dengan hati-hati dan kembalikan dalam
                kondisi seperti semula.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- MAIN COMPONENT ---
export default function Details() {
  const { slug } = useParams<{ slug: string }>();

  // All hooks must be called before any early returns
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  
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
  
  // Debug logging for date state in Details component
  useEffect(() => {
    console.log('🏠 Details.tsx: Date state from context:', {
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
      component: 'Details.tsx',
      source: 'context_state_debug'
    });
  }, [startDate, endDate, bookingDateRange, isDateRangeValid, areDatesSelected, formattedDateRange, updateCount, lastUpdateTime]);
  
  // Loading state for availability updates
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

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
  useEffect(() => {
    console.log('🔍 Details.tsx: React Query parameters:', {
      queryKey: ["product", slug, apiStartDate, apiEndDate],
      slug,
      originalDates: { startDate, endDate },
      debouncedDates: { debouncedStartDate, debouncedEndDate },
      apiDates: { apiStartDate, apiEndDate },
      shouldFetchWithDates,
      areDatesSelected,
      enabled: !!slug,
      source: 'react_query_debug'
    });
  }, [slug, startDate, endDate, debouncedStartDate, debouncedEndDate, apiStartDate, apiEndDate, shouldFetchWithDates, areDatesSelected]);

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Product>({
    queryKey: ["product", slug, apiStartDate, apiEndDate],
    queryFn: () => {
      console.log('🌐 Details.tsx: Executing fetchProduct with params:', {
        slug,
        startDate: apiStartDate,
        endDate: apiEndDate,
        source: 'fetchProduct_call'
      });
      return fetchProduct(slug, apiStartDate, apiEndDate);
    },
    staleTime: 10 * 60 * 1000, // fresh 10 menit
    gcTime: 30 * 60 * 1000, // cache hilang setelah 30 menit idle
    enabled: !!slug, // Only run when slug exists - dates are optional
  });
  
  // Monitor React Query state changes
  useEffect(() => {
    if (product) {
      console.log('✅ Details.tsx: React Query success:', {
        productName: product.name,
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
        console.log('✅ Details.tsx: Date state preserved after React Query success');
      }
    }
    
    if (isError && error) {
      console.error('❌ Details.tsx: React Query error:', {
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
      console.log('🏁 Details.tsx: React Query settled:', {
        hasData: !!product,
        hasError: isError,
        apiParams: { startDate: apiStartDate, endDate: apiEndDate },
        contextPreserved: {
          startDate,
          endDate,
          areDatesSelected,
          updateCount
        },
        source: 'react_query_settled'
      });
    }
  }, [product, isError, error, isLoading, startDate, endDate, apiStartDate, apiEndDate, areDatesSelected, updateCount]);

  // Memoized values that depend on product (with safe fallbacks)
  const whatsappLink = useMemo(() => {
    if (!product) return "";
    const message = `Halo, saya tertarik untuk menyewa ${product.name} sebanyak ${quantity} unit. Bisa beri info lebih lanjut?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
  }, [product?.name, quantity]);

  // Use proper availability calculation
  const availabilityInfo = useMemo(() => {
    if (!product) return { isAvailable: false, quantity: 0, text: 'Tidak tersedia' };
    return getProductAvailabilityText(product);
  }, [product]);
  
  const isAvailable = availabilityInfo.isAvailable;
  const availableQuantity = availabilityInfo.quantity;
  
  const formattedPrice = useMemo(() => {
    if (!product) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(product.price);
  }, [product?.price]);
  
  // Handler for date changes from booking form - using global context
  const handleDateChange = useCallback((newStartDate: string | null, newEndDate: string | null) => {
    console.log('🗓️ Details.tsx: handleDateChange called:', { 
      newStartDate, 
      newEndDate,
      previousDates: { startDate, endDate },
      contextUpdateCount: updateCount,
      component: 'Details.tsx',
      source: 'handleDateChange_call',
      stack: new Error().stack?.split('\n').slice(1, 5)
    });
    
    // Update dates using global context - no page refresh
    setBookingDates(newStartDate, newEndDate);
    
    console.log('✅ Details.tsx: setBookingDates called, waiting for context update');
  }, [setBookingDates, startDate, endDate, updateCount]);

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  }, []);

  // Generate SEO props for this product
  const seoProps = useMemo(() => {
    if (!product) return null;
    return {
      title: `Sewa ${product.name}`,
      description: `Sewa ${product.name} berkualitas tinggi dari ${product.brand?.name || 'brand terpercaya'}. Harga mulai ${formattedPrice}/hari. ${product.status === 'available' ? 'Tersedia untuk rental!' : 'Hubungi kami untuk ketersediaan.'} Proses mudah dan cepat.`,
      keywords: `rental ${product.name}, sewa ${product.category?.name || 'kamera'}, ${product.brand?.name || ''}, rental kamera ${product.category?.name || ''} Indonesia, sewa peralatan fotografi`,
      image: product.thumbnail ? `${STORAGE_BASE_URL}/${product.thumbnail}` : undefined,
      price: product.price,
      type: 'product' as const,
      category: product.category?.name,
      brand: product.brand?.name,
      availability: isAvailable ? 'InStock' as const : 'OutOfStock' as const
    };
  }, [product, formattedPrice]);

  if (isLoading) return <PageSkeleton />;

  if (isError || !product) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <MdError className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              {error instanceof Error ? error.message : "Produk Tidak Ditemukan"}
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

  return (
    <MainLayout>
      {/* SEO Head */}
      {seoProps && <EnhancedSEOHead {...seoProps} />}
      
      <NavCard />
      <div className="bg-gray-50 md:bg-white flex-1">
        <main className="max-w-[640px] md:max-w-[1130px] mx-auto px-4 sm:px-6 pb-24 md:pb-8 pt-20 md:pt-28">
          {/* Breadcrumb - Hidden on mobile */}
          <nav className="mb-4 md:mb-8 hidden md:block" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-muted">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">
                  Beranda
                </Link>
              </li>
              <li className="mx-2">/</li>
              {product.category ? (
                <li>
                  <Link
                    to={`/category/${product.category.slug || ""}`}
                    className="text-accent font-semibold hover:underline"
                  >
                    {product.category.name}
                  </Link>
                </li>
              ) : (
                <li>
                  <span className="text-gray-500">Tanpa Kategori</span>
                </li>
              )}
              <li className="text-dark font-medium" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          {/* Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-8 gap-y-6 md:gap-y-10 items-start">
            {/* Left side - Images and Specifications */}
            <div className="lg:col-span-3 space-y-8">
              <ProductImageGallery
                productName={product.name}
                photos={product.productPhotos || []}
              />
              <ProductSpecifications
                specifications={product.productSpecifications || []}
              />
            </div>
            
            {/* Right side - Product Info and Booking */}
      <ProductInfo 
        product={product} 
        isLoadingAvailability={isLoadingAvailability} 
      />
          </div>
          
          {/* Additional Information Below */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-8 gap-y-6 md:gap-y-10 items-start mt-12">
            {/* Empty space for columns 1-3 */}
            <div className="lg:col-span-3 hidden lg:block"></div>
            
            {/* RentalIncludes in columns 4-5 */}
            <div className="lg:col-span-2">
              <RentalIncludes
                productName={product.name}
                includes={product.rentalIncludes || []}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Action Bar - positioned above footer */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30 md:hidden">
        <div className="max-w-[640px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between space-x-3">
            {/* Price and Quantity */}
            <div className="flex-1">
              <div className="text-lg font-bold text-gray-900">
                {formattedPrice}
                <span className="text-sm font-normal text-gray-600 ml-1">
                  /hari
                </span>
              </div>
            </div>

            {/* Action Buttons */}
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
                <MdShoppingCart className="w-4 h-4 mr-2" />
                {isAvailable ? "Sewa Sekarang" : "Tidak Tersedia"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
