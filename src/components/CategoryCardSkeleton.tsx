// src/components/CategoryCardSkeleton.tsx
const CategoryCardSkeleton = () => {
  // Responsive card sizes yang sama dengan CategoryCard
  const cardVariants = [
    {
      visible: "md:hidden",
      width: "w-36",
      height: "h-36",
      text: "text-xs",
    },
    {
      visible: "hidden md:block",
      width: "w-[230px]",
      height: "h-[300px]",
      text: "text-sm",
    },
  ];

  return (
    <>
      {cardVariants.map((variant, _idx) => (
        <div className={`card ${variant.visible}`} key={variant.visible}>
          <div
            className={`relative flex shrink-0 ${variant.width} ${variant.height} rounded-2xl ring-1 ring-light overflow-hidden shadow-md`}
          >
            {/* Background image skeleton */}
            <div className="absolute w-full h-full bg-gray-200 animate-pulse"></div>
            
            {/* Content overlay skeleton */}
            <div className="relative flex flex-col justify-end w-full h-full p-5 gap-1 bg-[linear-gradient(180deg,_rgba(0,0,0,0)_49.87%,_rgba(0,0,0,0.8)_100%)] z-10">
              {/* Category name skeleton */}
              <div className={`${variant.text === 'text-xs' ? 'h-3' : 'h-4'} bg-gray-300 rounded animate-pulse w-3/4`}></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CategoryCardSkeleton;
