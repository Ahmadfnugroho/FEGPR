import { useState, useMemo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import NavCard from "../components/navCard";
import { useParams, Link } from "react-router-dom";
import {
  MdFavorite,
  MdShoppingCart,
  MdAdd,
  MdRemove,
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
import FooterSection from "../components/FooterSection";
import BottomNavigation from "../components/BottomNavigation";
import AnimatedPulseBorder from "../components/AnimatedPulseBorder";
import EnhancedBookingForm from "../components/EnhancedBookingForm";

const fetchBundling = async (slug: string | undefined) => {
  if (!slug) throw new Error("No slug provided");
  const { data } = await axiosInstance.get(`/bundling/${slug}`);
  return data.data as Bundling;
};

export default function BundlingDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [expandedSpecs, setExpandedSpecs] = useState<{
    [key: number]: boolean;
  }>({});

  const {
    data: bundling,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Bundling, Error>({
    queryKey: ["bundling", slug],
    queryFn: () => fetchBundling(slug),
    enabled: !!slug,
  });

  // Move all computed values and memoized values here to maintain hooks order
  const allPhotos: ((ProductPhoto | BundlingPhoto) & { productName: string })[] = useMemo(() => {
    if (!bundling) return [];
    const photos: ((ProductPhoto | BundlingPhoto) & { productName: string })[] = [];
    
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
  const whatsappLink = useMemo(() => {
    if (!bundling) return "";
    const message = `Halo, saya tertarik untuk menyewa bundling ${bundling.name} sebanyak ${quantity} paket. Bisa beri info lebih lanjut?`;
    return `https://wa.me/6281212349564?text=${encodeURIComponent(message)}`;
  }, [bundling, quantity]);

  // Calculate bundling availability - all products must be available
  const isAvailable = useMemo(() => {
    if (!bundling) return false;
    return bundling.products.every((product) => product.status === "available");
  }, [bundling]);

  // Get unavailable products for display
  const unavailableProducts = useMemo(() => {
    if (!bundling) return [];
    return bundling.products.filter(
      (product) => product.status !== "available"
    );
  }, [bundling]);

  const formattedPrice = useMemo(() => {
    if (!bundling) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(bundling.price);
  }, [bundling]);

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  }, []);

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
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
    );
  }

  if (!bundling) {
    return (
      <>
        <NavCard />
        <AnimatedPulseBorder isLoading={true}>
          <div className="bg-gray-50 md:bg-white min-h-screen">
            <main className="max-w-[640px] md:max-w-[1130px] mx-auto px-4 sm:px-6 pb-32 md:pb-8 pt-20 md:pt-28">
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
      </>
    );
  }

  return (
    <>
      <NavCard />
      <AnimatedPulseBorder isLoading={isLoading}>
        <div className="bg-gray-50 md:bg-white min-h-screen">
          <main className="max-w-[640px] md:max-w-[1130px] mx-auto px-4 sm:px-6 pb-32 md:pb-8 pt-20 md:pt-28 has-[#Bottom-nav]:pb-40 scroll-fade-in">
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
                                  Rp{product.price.toLocaleString("id-ID")}
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
              <div className="lg:col-span-2 scroll-fade-in" data-delay="200">
                <div
                  className="flex flex-col h-full justify-between"
                  style={{ minHeight: "350px", maxHeight: "350px" }}
                >
                  {/* Atas */}
                  <div className="mb-4 scroll-fade-in" data-delay="300">
                    {/* Availability Status */}
                    <div className="mb-4">
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

                    <span className="inline-block rounded-full px-3 py-2 font-bold text-lg text-center text-white bg-text-light-primary mb-4">
                      📦 Bundling Package
                    </span>
                    {bundling.premiere && (
                      <span className="inline-block rounded-full px-3 py-1 font-semibold text-sm text-white bg-amber-500 ml-2">
                        ⭐ Rekomendasi
                      </span>
                    )}
                  </div>

                  {/* Tengah */}
                  <div
                    className="flex flex-col gap-5 mb-5 scroll-fade-in"
                    data-delay="400"
                  >
                    <h1 className="font-extrabold text-3xl lg:text-4xl">
                      {bundling.name}
                    </h1>
                    <div className="flex items-center text-lg text-muted">
                      <span className="font-semibold">
                        {bundling.products.length} produk dalam paket
                      </span>
                    </div>
                    <p className="font-extrabold text-3xl text-dark">
                      Rp{bundling.price.toLocaleString("id-ID")} /hari
                    </p>
                    <div className="text-sm text-muted">
                      <p className="mb-1">💰 Hemat dibanding sewa terpisah:</p>
                      <p className="font-semibold text-green-600">
                        Rp
                        {(
                          bundling.products.reduce(
                            (total, product) =>
                              total + product.price * product.quantity,
                            0
                          ) - bundling.price
                        ).toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* Unavailable Products Warning */}
                    {!isAvailable && unavailableProducts.length > 0 && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
                              <span className="text-white text-xs font-bold">
                                !
                              </span>
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-red-800 mb-1">
                              Produk tidak tersedia:
                            </h4>
                            <ul className="text-xs text-red-700 space-y-1">
                              {unavailableProducts.map((product) => (
                                <li
                                  key={product.id}
                                  className="flex items-center"
                                >
                                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                                  {product.quantity > 1 &&
                                    `${product.quantity}x `}
                                  {product.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Booking Form */}
                  <EnhancedBookingForm 
                    item={bundling} 
                    type="bundling" 
                    className="mt-6 mb-8"
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </AnimatedPulseBorder>


      <FooterSection />
      <BottomNavigation />
    </>
  );
}
