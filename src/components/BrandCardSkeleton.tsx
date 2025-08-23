// src/components/BrandCardSkeleton.tsx
const BrandCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg md:rounded-xl shadow-sm flex items-center justify-center p-3 md:p-4 lg:p-6 border border-light h-16 md:h-20 lg:h-24">
      {/* Logo skeleton */}
      <div className="max-h-[20px] md:max-h-[32px] lg:max-h-[40px] w-16 md:w-20 lg:w-24 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
};

export default BrandCardSkeleton;
