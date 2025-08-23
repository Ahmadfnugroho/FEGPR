// src/components/FormSkeleton.tsx
const FormSkeleton = () => {
  return (
    <>
      <div
        id="Banner"
        className="relative w-full h-[240px] flex items-center shrink-0 overflow-hidden -mb-[50px] parallax-container"
      >
        <h1 className="text-center mx-auto font-extrabold text-[40px] leading-[60px] text-white mb-5 z-20">
          Mulai Sewa Produk yang Anda Inginkan
        </h1>
        <div className="absolute w-full h-full bg-[linear-gradient(180deg,_rgba(0,0,0,0)_0%,#000000_91.83%)] z-10" />
        <img
          src="/assets/images/thumbnails/thumbnail-details-4.png"
          className="absolute w-full h-full object-cover object-top parallax-bg scale-110"
          data-parallax-speed="-0.1"
          alt=""
        />
      </div>

      <div className="relative flex justify-center max-w-[1130px] mx-auto gap-[30px] mb-20 z-20">
        <div className="flex flex-col shrink-0 w-[500px] h-fit rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white animate-pulse">
          {/* Product info skeleton */}
          <div className="flex items-center gap-4">
            <div className="flex shrink-0 w-[140px] h-[100px] rounded-[20px] bg-gray-200"></div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="flex items-center gap-[6px]">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>

          <hr className="border-[#F6F5FD]" />

          <div className="flex flex-col gap-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            
            {/* Form fields skeleton */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-12 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>

          <hr className="border-[#F6F5FD]" />

          {/* Summary skeleton */}
          <div className="flex flex-col gap-4">
            <div className="h-6 bg-gray-200 rounded w-40"></div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-28"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <hr />
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>

          {/* Button skeleton */}
          <div className="h-12 bg-gray-200 rounded-full"></div>
        </div>

        {/* Side image skeleton */}
        <div className="flex shrink-0 w-[500px] h-[700px] rounded-[20px] bg-gray-200 animate-pulse"></div>
      </div>
    </>
  );
};

export default FormSkeleton;
