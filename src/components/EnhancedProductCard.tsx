import React, { useState, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  CameraIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  StarIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { STORAGE_BASE_URL } from '../api/constants';
import type { Product } from '../types/type';

interface EnhancedProductCardProps {
  product: Product;
  onWishlistToggle?: (productId: string) => void;
  isInWishlist?: boolean;
  showQuickActions?: boolean;
  variant?: 'grid' | 'list';
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = memo(({
  product,
  onWishlistToggle,
  isInWishlist = false,
  showQuickActions = true,
  variant = 'grid'
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'available':
        return {
          icon: CheckCircleIcon,
          label: 'Tersedia',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'rented':
        return {
          icon: ClockIcon,
          label: 'Disewa',
          className: 'bg-orange-100 text-orange-800 border-orange-200'
        };
      case 'maintenance':
        return {
          icon: XCircleIcon,
          label: 'Maintenance',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          icon: XCircleIcon,
          label: 'Tidak Tersedia',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
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

  const handleWishlistClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onWishlistToggle) {
      onWishlistToggle(product.id.toString());
    }
  }, [onWishlistToggle, product.id]);

  if (variant === 'list') {
    return (
      <Link 
        to={`/product/${product.slug}`}
        className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
      >
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
            <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100">
              {imageLoading && (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              )}
              {!imageError ? (
                <img
                  src={product.photo ? `${STORAGE_BASE_URL}/${product.photo}` : '/images/placeholder-product.png'}
                  alt={product.name}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
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
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.className}`}>
                <StatusIcon className="w-3 h-3" />
                <span className="hidden sm:inline">{statusConfig.label}</span>
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 group-hover:text-navy-blue-800 transition-colors">
                {product.name}
              </h3>
              
              {showQuickActions && (
                <button
                  onClick={handleWishlistClick}
                  className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Toggle wishlist"
                >
                  {isInWishlist ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600">
              <CameraIcon className="w-3 h-3" />
              <span>{product.category?.name}</span>
              {product.brand && (
                <>
                  <span>•</span>
                  <span>{product.brand.name}</span>
                </>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-lg md:text-xl font-bold text-navy-blue-800">
                  {formatPrice(product.price)}
                  <span className="text-sm font-normal text-gray-600">/hari</span>
                </div>
                
                {/* Mock rating */}
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">4.5 (12 ulasan)</span>
                </div>
              </div>

              {product.status === 'available' && (
                <button className="px-4 py-2 bg-navy-blue-800 text-white rounded-lg text-sm font-medium hover:bg-navy-blue-900 transition-colors">
                  Sewa Sekarang
                </button>
              )}
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
        {/* Status badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${statusConfig.className}`}>
            <StatusIcon className="w-3 h-3" />
            <span className="hidden sm:inline">{statusConfig.label}</span>
          </span>
        </div>

        {/* Wishlist button */}
        {showQuickActions && (
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
            aria-label="Toggle wishlist"
          >
            {isInWishlist ? (
              <HeartSolidIcon className="w-4 h-4 text-red-500" />
            ) : (
              <HeartIcon className="w-4 h-4 text-gray-600" />
            )}
          </button>
        )}

        {/* Image with loading state */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {!imageError ? (
          <img
            src={product.photo ? `${STORAGE_BASE_URL}/${product.photo}` : '/images/placeholder-product.png'}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <CameraIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <span className="text-xs text-gray-500">Gambar tidak tersedia</span>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-navy-blue-800 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <CameraIcon className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{product.category?.name}</span>
            {product.brand && (
              <>
                <span className="text-gray-400">•</span>
                <span className="truncate">{product.brand.name}</span>
              </>
            )}
          </div>
        </div>

        {/* Mock rating */}
        <div className="flex items-center gap-1">
          <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-600">4.5</span>
          <span className="text-xs text-gray-400">(12)</span>
        </div>

        {/* Price and action */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="font-bold text-navy-blue-800">
              <span className="text-lg">{formatPrice(product.price)}</span>
              <span className="text-sm font-normal text-gray-600">/hari</span>
            </div>
          </div>

          {product.status === 'available' ? (
            <button 
              className="px-3 py-1.5 bg-navy-blue-800 text-white rounded-lg text-xs font-medium hover:bg-navy-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-blue-800 focus:ring-offset-2"
              onClick={(e) => {
                e.preventDefault();
                // Handle quick rent action
              }}
            >
              Sewa
            </button>
          ) : (
            <button 
              disabled
              className="px-3 py-1.5 bg-gray-300 text-gray-500 rounded-lg text-xs font-medium cursor-not-allowed"
            >
              Tidak Tersedia
            </button>
          )}
        </div>
      </div>
    </Link>
  );
});

EnhancedProductCard.displayName = 'EnhancedProductCard';

export default EnhancedProductCard;
