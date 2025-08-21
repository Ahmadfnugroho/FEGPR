import React from "react";

interface LoadingCardProps {
  variant?: "product" | "bundling" | "simple";
  count?: number;
}

const LoadingCard: React.FC<LoadingCardProps> = ({
  variant = "product",
  count = 1,
}) => {
  // Render a single card skeleton based on variant
  const renderSkeleton = (index: number) => {
    if (variant === "bundling") {
      return (
        <div
          key={index}
          className="rounded-xl border border-light dark:border-dark bg-white dark:bg-dark/90 shadow-sm h-full flex flex-col relative overflow-hidden"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"></div>

          {/* Thumbnail */}
          <div className="aspect-[4/3] bg-light dark:bg-dark/80 rounded-t-xl animate-pulse" />

          {/* Content */}
          <div className="p-3 md:p-4 flex-grow flex flex-col gap-3">
            <div className="h-4 md:h-5 bg-light dark:bg-dark/80 rounded-full w-3/4 animate-pulse" />
            <div className="h-3 md:h-4 bg-light dark:bg-dark/80 rounded-full w-1/2 animate-pulse" />

            <div className="space-y-2 mt-2">
              <div className="h-2 md:h-3 bg-light dark:bg-dark/80 rounded-full w-full animate-pulse" />
              <div className="h-2 md:h-3 bg-light dark:bg-dark/80 rounded-full w-5/6 animate-pulse" />
              <div className="h-2 md:h-3 bg-light dark:bg-dark/80 rounded-full w-4/6 animate-pulse" />
            </div>

            <div className="mt-auto pt-2">
              <div className="h-5 md:h-6 bg-light dark:bg-dark/80 rounded-full w-1/3 animate-pulse" />
            </div>
          </div>
        </div>
      );
    } else if (variant === "simple") {
      return (
        <div
          key={index}
          className="rounded-lg border border-light dark:border-dark bg-white dark:bg-dark/90 p-3 shadow-sm h-full relative overflow-hidden"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"></div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-light dark:bg-dark/80 animate-pulse" />
            <div className="flex-1">
              <div className="h-3 bg-light dark:bg-dark/80 rounded-full w-3/4 mb-2 animate-pulse" />
              <div className="h-2 bg-light dark:bg-dark/80 rounded-full w-1/2 animate-pulse" />
            </div>
          </div>
        </div>
      );
    } else {
      // Default product variant
      return (
        <div
          key={index}
          className="rounded-xl md:rounded-lg border border-light dark:border-dark bg-white dark:bg-dark/90 p-2 md:p-3 shadow-sm h-full flex flex-col relative overflow-hidden"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"></div>

          {/* Thumbnail */}
          <div className="w-full h-24 sm:h-28 md:h-32 bg-light dark:bg-dark/80 rounded-md mb-2 md:mb-3 flex-shrink-0 animate-pulse" />

          {/* Content */}
          <div className="flex-grow flex flex-col justify-between gap-2">
            <div className="space-y-2">
              <div className="h-2.5 md:h-3.5 bg-light dark:bg-dark/80 rounded-full w-3/4 animate-pulse" />
              <div className="h-2 md:h-3 bg-light dark:bg-dark/80 rounded-full w-1/2 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="h-2 md:h-2.5 bg-light dark:bg-dark/80 rounded-full w-2/3 animate-pulse" />
              <div className="h-6 md:h-8 bg-light dark:bg-dark/80 rounded-full w-full animate-pulse" />
            </div>
          </div>
        </div>
      );
    }
  };

  // Render multiple skeletons
  return (
    <>
      {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
    </>
  );
};

export default LoadingCard;
