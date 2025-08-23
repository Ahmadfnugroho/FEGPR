// src/components/BundlingCardSkeleton.tsx
const BundlingCardSkeleton = () => {
  return (
    <div className="bg-base-primary rounded-xl shadow-sm overflow-hidden border border-support-subtle h-full flex flex-col">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] bg-gray-200 animate-pulse">
        {/* Badge skeleton */}
        <div className="absolute top-2 left-2">
          <div className="w-16 h-6 bg-gray-300 rounded animate-pulse"></div>
        </div>
        
        {/* Premiere badge skeleton */}
        <div className="absolute top-2 right-2">
          <div className="w-8 h-6 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-2 md:p-3 lg:p-4 flex-grow flex flex-col">
        {/* Title skeleton */}
        <div className="space-y-2 mb-1 md:mb-2 flex-shrink-0">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>

        {/* Products count skeleton */}
        <div className="h-3 bg-gray-200 rounded animate-pulse w-24 mb-1 md:mb-2 flex-shrink-0"></div>

        {/* Product list skeleton */}
        <div className="mb-2 flex-grow">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16 mb-0.5 md:mb-1"></div>
          <div className="space-y-0.5 md:space-y-1">
            {/* Product items skeleton */}
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start">
                <div className="w-1 h-1 bg-gray-300 rounded-full mr-1 md:mr-2 mt-1 md:mt-1.5 flex-shrink-0 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse flex-1"></div>
              </div>
            ))}
            {/* Additional products indicator skeleton */}
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
        </div>

        {/* Price skeleton */}
        <div className="flex items-center justify-between mt-auto flex-shrink-0">
          <div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-24 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundlingCardSkeleton;
