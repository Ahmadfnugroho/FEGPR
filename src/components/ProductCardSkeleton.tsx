// src/components/ProductCardSkeleton.tsx
const ProductCardSkeleton = () => {
  return (
    <div className="card">
      <div className="flex flex-col rounded-xl md:rounded-2xl border border-support-subtle bg-base-secondary shadow-md h-full">
        {/* Thumbnail Container Skeleton */}
        <div className="relative w-full h-[150px] sm:h-[160px] md:h-[180px] mb-3 md:mb-4 overflow-hidden rounded-t-xl md:rounded-t-2xl bg-gray-200 animate-pulse">
          {/* Popular badge skeleton */}
          <div className="absolute top-1 right-1 md:top-2 md:right-2 w-12 h-4 rounded-full bg-gray-300 animate-pulse"></div>
          
          {/* Main image skeleton */}
          <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          
          {/* Pagination dots skeleton */}
          <div className="absolute bottom-2 md:bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
          </div>
        </div>

        {/* Detail Produk Skeleton */}
        <div className="card-detail-container flex flex-col gap-1.5 md:gap-2 flex-grow px-2 md:px-3 lg:px-4 pb-2 md:pb-3 lg:pb-4">
          {/* Product name skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto w-1/2"></div>
          </div>

          {/* Price skeleton */}
          <div className="flex justify-center mt-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>

          {/* Button skeleton */}
          <div className="w-full mt-auto">
            <div className="h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
