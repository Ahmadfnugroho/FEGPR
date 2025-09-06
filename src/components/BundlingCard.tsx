import React from "react";
import type { Bundling } from "../types/type";
import { STORAGE_BASE_URL } from "../api/constants";

interface BundlingCardProps {
  bundling: Bundling;
}

const BundlingCard: React.FC<BundlingCardProps> = ({ bundling }) => {

  // Get thumbnail - prioritize bundling photos first, then product photos as fallback
  const getThumbnail = () => {
    // First priority: bundling photos
    if (bundling.bundlingPhotos && bundling.bundlingPhotos.length > 0) {
      return `${STORAGE_BASE_URL}/${bundling.bundlingPhotos[0].photo}`;
    }
    
    // Fallback: product photos
    for (const product of bundling.products) {
      if (product.productPhotos && product.productPhotos.length > 0) {
        return `${STORAGE_BASE_URL}/${product.productPhotos[0].photo}`;
      }
    }
    
    // Final fallback: placeholder
    return "/placeholder-image.jpg";
  };

  return (
    <div className="bg-base-primary rounded-xl shadow-sm hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 overflow-hidden border border-support-subtle h-full flex flex-col group">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-base-tertiary overflow-hidden">
        <img
          src={getThumbnail()}
          alt={bundling.name}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-image.jpg";
          }}
        />

        {/* Badge for bundling */}
        <div className="absolute top-2 left-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold text-navy-blue-50 bg-navy-blue-800 rounded shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
            Bundling
          </span>
        </div>

        {/* Premiere badge */}
        {bundling.premiere && (
          <div className="absolute top-2 right-2">
            <span className="inline-block px-1.5 md:px-2 py-1 text-xs font-semibold text-white bg-amber-500 rounded shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 group-hover:rotate-3">
              <span className="hidden sm:inline">⭐ Rekomendasi</span>
              <span className="sm:hidden">⭐</span>
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2 md:p-3 lg:p-4 flex-grow flex flex-col transition-all duration-300 group-hover:transform group-hover:translate-y-[-2px]">
        {/* Title */}
        <h3 className="font-bold text-sm md:text-base lg:text-lg text-support-primary mb-1 md:mb-2 line-clamp-2 flex-shrink-0 transition-all duration-300 group-hover:text-navy-blue-800">
          {bundling.name}
        </h3>

        {/* Products count */}
        <p className="text-[10px] md:text-xs text-support-tertiary mb-1 md:mb-2 flex-shrink-0">
          {bundling.products.length} produk dalam paket
        </p>

        {/* Product list (max 3 items) */}
        <div className="mb-2 flex-grow">
          <p className="text-[10px] md:text-xs text-support-tertiary mb-0.5 md:mb-1">
            Termasuk:
          </p>
          <div className="space-y-0.5 md:space-y-1">
            {bundling.products.slice(0, 3).map((product) => (
              <div
                key={product.id}
                className="flex items-start text-[10px] md:text-xs text-support-tertiary"
              >
                <span className="w-1 h-1 bg-navy-blue-500 rounded-full mr-1 md:mr-2 mt-1 md:mt-1.5 flex-shrink-0"></span>
                <span className="line-clamp-1 leading-tight md:leading-relaxed">
                  {product.quantity > 1 && `${product.quantity}x `}
                  {product.name}
                </span>
              </div>
            ))}
            {bundling.products.length > 3 && (
              <div className="text-[10px] md:text-xs text-support-tertiary">
                +{bundling.products.length - 3} produk lainnya
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto flex-shrink-0">
          <div>
            <p className="font-bold text-sm md:text-base lg:text-lg text-navy-blue-800 transition-all duration-300 group-hover:scale-105">
              Rp{bundling.price.toLocaleString("id-ID")}
            </p>
            <p className="text-[10px] md:text-xs text-support-tertiary">
              /hari
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundlingCard;
