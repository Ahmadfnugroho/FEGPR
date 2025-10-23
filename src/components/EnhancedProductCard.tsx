import React, { useState, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  CameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { STORAGE_BASE_URL } from "../api/constants";
import type { Product } from "../types/type";

// Extend Product interface to ensure all image fields are available
type ProductWithImages = Product & {
  productPhotos?: Array<{ id: number; photo: string }>;
};

interface EnhancedProductCardProps {
  product: ProductWithImages;
  variant?: "grid" | "list";
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = memo(
  ({ product, variant = "grid" }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    };

    const getStatusConfig = (status: string) => {
      switch (status) {
        case "available":
          return {
            icon: CheckCircleIcon,
            label: "Tersedia",
            className: "bg-green-100 text-green-800 border-green-200",
          };
        case "rented":
          return {
            icon: ClockIcon,
            label: "Disewa",
            className: "bg-orange-100 text-orange-800 border-orange-200",
          };
        case "maintenance":
          return {
            icon: XCircleIcon,
            label: "Maintenance",
            className: "bg-red-100 text-red-800 border-red-200",
          };
        default:
          return {
            icon: XCircleIcon,
            label: "Tidak Tersedia",
            className: "bg-gray-100 text-gray-800 border-gray-200",
          };
      }
    };

    const statusConfig = getStatusConfig(product.status);
    const StatusIcon = statusConfig.icon;

    const handleImageError = useCallback(() => {
      setImageError(true);
      setImageLoading(false);
    }, []);

    const handleImageLoad = useCallback(() => {
      setImageLoading(false);
    }, []);

    if (variant === "list") {
      return (
        <Link
          to={`/product/${product.slug}`}
          className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
        >
          <div className="flex gap-5 p-5">
            {/* Image */}
            <div className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0">
              <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100">
                {imageLoading && (
                  <div className="w-full h-full bg-gray-200 animate-pulse" />
                )}
                {!imageError ? (
                  <img
                    src={
                      product.photo
                        ? `${STORAGE_BASE_URL}/${product.photo}`
                        : product.productPhotos?.[0]?.photo
                        ? `${STORAGE_BASE_URL}/${product.productPhotos[0].photo}`
                        : "/images/placeholder-product.png"
                    }
                    alt={product.name}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                      imageLoading ? "opacity-0" : "opacity-100"
                    }`}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <CameraIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Status badge */}
              <div className="absolute -top-2 -right-2">
                <span
                  className={`inline-flex items-center rounded-full text-xs font-xs border ${statusConfig.className}`}
                >
                  <StatusIcon className="" />
                  <span className="hidden sm:inline">{statusConfig.label}</span>
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="mt-auto">
              <div className="flex-1 min-w-0 space-y-4">
                <h3 className="text-gray-900 text-base md:text-xs font-extralight line-clamp-2 group-hover:text-navy-blue-800 transition-colors">
                  {product.name}
                </h3>

                <div className="space-y-4">
                  <div className="text-xs md:text-xs font-bold text-navy-blue-800">
                    {formatPrice(product.price)}
                    <span className="text-xs font-normal text-gray-600">
                      /hari
                    </span>
                  </div>

                  {product.status === "available" ? (
                    <button className="w-full px-5 py-3 bg-navy-blue-800 text-white rounded-lg text-base font-medium hover:bg-navy-blue-900 transition-colors transform hover:scale-105">
                      Sewa Sekarang
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full px-5 py-3 bg-gray-300 text-gray-500 rounded-lg text-base font-medium cursor-not-allowed"
                    >
                      Tidak Tersedia
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      );
    }

    // Grid variant (default)
    return (
      <Link
        to={`/product/${product.slug}`}
        className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-navy-blue-200"
      >
        {/* Image container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {product.premiere == 1 && (
            <div className="absolute top right-1 z-10">
              <span className="inline-flex  text-[8px]  text-white bg-text-light-primary rounded shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 group-hover:rotate-3">
                <span className="hidden sm:inline">⭐Terlaris</span>
                <span className="sm:hidden">⭐</span>
              </span>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-1 left-1 z-10">
            <span
              className={`inline-flex items-center rounded-full text-[8px] border backdrop-blur-sm  ${statusConfig.className}`}
            >
              <StatusIcon className="w-3 h-3" />
              <span className="hidden sm:inline">{statusConfig.label}</span>
            </span>
          </div>

          {/* Image with loading state */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {!imageError ? (
            <img
              src={
                product.photo
                  ? `${STORAGE_BASE_URL}/${product.photo}`
                  : product.productPhotos?.[0]?.photo
                  ? `${STORAGE_BASE_URL}/${product.productPhotos[0].photo}`
                  : "/images/placeholder-product.png"
              }
              alt={product.name}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <span className="text-xs text-gray-500">
                  Gambar tidak tersedia
                </span>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Content */}
        <div className="p-1 flex flex-col h-auto justify-between">
          <h3 className="font-extralight text-gray-900 text-[10px] line-clamp-2 group-hover:text-navy-blue-800 transition-colors whitespace-normal break-words text-center h-auto">
            {product.name}
          </h3>

          {/* Price and action */}
          <div className="mt-auto flex flex-col items-center gap-1">
            {/* Harga */}
            <div className="font-bold text-navy-blue-800 text-center">
              <span className="text-[10px] font-extralight">
                {formatPrice(product.price)}
              </span>
              <span className="text-[10px] font-extralight text-gray-600">
                /hari
              </span>
            </div>

            {/* Tombol */}
            {/* {product.status === "available" ? (
              <button
                className="w-3/4 py-1 bg-navy-blue-800 text-white rounded-lg text-[10px] font-thin hover:bg-navy-blue-900 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-navy-blue-800 focus:ring-offset-2 whitespace-nowrap"
                onClick={(e) => {
                  e.stopPropagation(); // cegah trigger Link parent
                  window.location.href = `/product/${product.slug}`;
                }}
              >
                Sewa Sekarang
              </button>
            ) : (
              <button
                disabled
                className="w-3/4 py-1 bg-gray-300 text-gray-500 rounded-lg text-[10px] font-thin cursor-not-allowed whitespace-nowrap"
              >
                Tidak Tersedia
              </button>
            )} */}
          </div>
        </div>
      </Link>
    );
  }
);

EnhancedProductCard.displayName = "EnhancedProductCard";

export default EnhancedProductCard;
