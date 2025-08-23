// src/components/ProductSkeleton.tsx
import React from "react";

export default function ProductSkeleton() {
  return (
    <div className="rounded-xl md:rounded-lg border border-light bg-white p-2 md:p-3 shadow-sm h-full flex flex-col relative overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      {/* Thumbnail */}
      <div className="w-full h-24 sm:h-28 md:h-32 bg-light rounded-md mb-2 md:mb-3 flex-shrink-0 animate-pulse" />

      {/* Content */}
      <div className="flex-grow flex flex-col justify-between gap-2">
        <div className="space-y-2">
          <div className="h-2.5 md:h-3.5 bg-light rounded-full w-3/4 animate-pulse" />
          <div className="h-2 md:h-3 bg-light rounded-full w-1/2 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="h-2 md:h-2.5 bg-light rounded-full w-2/3 animate-pulse" />
          <div className="h-6 md:h-8 bg-light rounded-full w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
