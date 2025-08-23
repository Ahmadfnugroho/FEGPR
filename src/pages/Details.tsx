import { useMemo, useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import FooterSection from "../components/FooterSection";
import PageSkeleton from "../components/PageSkeleton";

// Constants
// Menggunakan API_BASE_URL dari axiosInstance
const WHATSAPP_NUMBER = "6281212349564";

// --- API HELPER ---
const fetchProduct = async (slug: string | undefined): Promise<Product> => {
  if (!slug) throw new Error("Slug produk tidak ditemukan");

  const { data } = await axiosInstance.get<{ data: Product }>(
    `/product/${slug}`,
    { timeout: 10000 }
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
      <div className="lg:col-span-3">
        <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl bg-gray-100 flex items-center justify-center shadow-sm border">
          <div className="text-center">
            <MdError className="w-16 h-16 text-gray-400 mx-auto mb-3" />
            <span className="text-gray-500 text-lg">
              Tidak ada gambar tersedia
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 space-y-4">
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
                  loading={index === 0 ? "eager" : "lazy"}
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

const ProductInfo = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const whatsappLink = useMemo(() => {
    const message = `Halo, saya tertarik untuk menyewa ${product.name} sebanyak ${quantity} unit. Bisa beri info lebih lanjut?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
  }, [product.name, quantity]);

  const categoryItems = useMemo(
    () =>
      [product.category, product.subCategory, product.brand]
        .filter(Boolean)
        .map((item) => item?.name)
        .filter(Boolean),
    [product.category, product.subCategory, product.brand]
  );

  const isAvailable = product.status === "available";
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.price);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  // Mock rating data - replace with real data if available
  const rating = 4.5;
  const reviewCount = 145;

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
          {isAvailable ? "Tersedia" : "Tidak Tersedia"}
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

      {/* Rating and Reviews */}

      {/* Delivery Location */}

      {/* Price */}
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-6 border">
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {formattedPrice}
            <span className="text-lg font-normal text-gray-600 ml-1">
              /hari
            </span>
          </p>
        </div>

        {/* Quantity Selector */}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex space-x-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isAvailable
                ? "bg-text-light-primary hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
            {...(!isAvailable && { "aria-disabled": "true" })}
          >
            <MdShoppingCart className="w-5 h-5 mr-2" />
            {isAvailable ? "Sewa Sekarang" : "Not Available"}
          </a>
        </div>
      </div>

      {/* Additional Options */}

      {/* Pickup/Delivery Options */}
    </div>
  );
};

const ProductSpecifications = ({
  specifications,
}: {
  specifications: productSpecification[];
}) => {
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

  return (
    <section className="lg:col-span-3 bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h2 className="font-semibold text-xl text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
          Product Specifications
        </h2>
      </div>

      <div className="p-6">
        <dl className="grid grid-cols-1 gap-4">
          {specLines.map((spec) => (
            <div
              key={spec.id}
              className={`${
                spec.isHeader
                  ? "bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2"
                  : "pl-4 border-l-2 border-gray-200 hover:border-blue-300 transition-colors py-2"
              }`}
            >
              <dd
                className={`${
                  spec.isHeader
                    ? "font-semibold text-blue-900 text-base"
                    : "text-gray-700 text-sm leading-relaxed"
                }`}
              >
                {!spec.isHeader && (
                  <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-3 -translate-y-0.5"></span>
                )}
                {spec.text}
              </dd>
            </div>
          ))}
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
    <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h2 className="font-semibold text-xl text-gray-900 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
          What's Included
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-3">
          {includeItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
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
              <h4 className="text-sm font-medium text-blue-900">
                Rental Terms
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                All items are thoroughly cleaned and tested before rental.
                Please handle with care and return in the same condition.
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

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    staleTime: 10 * 60 * 1000, // fresh 10 menit
    gcTime: 30 * 60 * 1000, // cache hilang setelah 30 menit idle
  });

  // Memoized values that depend on product (with safe fallbacks)
  const whatsappLink = useMemo(() => {
    if (!product) return "";
    const message = `Halo, saya tertarik untuk menyewa ${product.name} sebanyak ${quantity} unit. Bisa beri info lebih lanjut?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
  }, [product?.name, quantity]);

  const isAvailable = product?.status === "available";
  const formattedPrice = useMemo(() => {
    if (!product) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(product.price);
  }, [product?.price]);

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  }, []);

  if (isLoading) return <PageSkeleton />;

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
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
    );
  }

  return (
    <>
      <NavCard />
      <div className="bg-gray-50 md:bg-white min-h-screen">
        <main className="max-w-[640px] md:max-w-[1130px] mx-auto px-4 sm:px-6 pb-32 md:pb-8 pt-20 md:pt-28 has-[#Bottom-nav]:pb-40">
          {/* Breadcrumb - Hidden on mobile */}
          <nav className="mb-8 hidden md:block" aria-label="Breadcrumb">
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
            <ProductImageGallery
              productName={product.name}
              photos={product.productPhotos || []}
            />
            <ProductInfo product={product} />
            <ProductSpecifications
              specifications={product.productSpecifications || []}
            />
            <RentalIncludes
              productName={product.name}
              includes={product.rentalIncludes || []}
            />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 md:hidden">
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

      <FooterSection />
      <BottomNavigation />
    </>
  );
}
