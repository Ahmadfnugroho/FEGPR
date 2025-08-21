// src/components/ProductCard.tsx
import { Product } from "../types/type";
import { memo, useState } from "react";
import "swiper/swiper-bundle.css";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Modal untuk zoom
const ImageModal = ({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full w-full">
        <button
          onClick={onClose}
          className="absolute -top-8 md:-top-10 right-0 text-white text-xl md:text-2xl font-bold hover:text-gray-300 hover:scale-110 transition-all duration-300"
        >
          ✕
        </button>
        <img
          src={src}
          alt={alt}
          className="w-full max-w-full max-h-[85vh] md:max-h-[90vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const baseURL = "http://gpr.id/storage";

  // Ambil semua foto, fallback ke placeholder
  const photos =
    product.productPhotos?.length > 0
      ? product.productPhotos.map((p) => `${baseURL}/${p.photo}`)
      : ["/images/placeholder-product.png"];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const openModal = (img: string) => {
    setModalImage(img);
    setIsModalOpen(true);
  };

  return (
    <div className="card">
      <div
        className="flex flex-col rounded-xl md:rounded-2xl border border-support-subtle bg-base-secondary shadow-md hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group focus-within:ring-2 focus-within:ring-pop-primary cursor-pointer h-full"
        tabIndex={0}
        aria-label={`Lihat detail produk ${product.name}`}
      >
        {/* Thumbnail Carousel */}
        <div className="thumbnail-container relative w-full h-[150px] sm:h-[160px] md:h-[180px] mb-3 md:mb-4 overflow-hidden rounded-t-xl md:rounded-t-2xl">
          <p className="absolute top-1 right-1 md:top-2 md:right-2 w-fit rounded-full px-1 py-0.5 md:px-1.5 md:py-0.5 bg-semantic-warning text-white font-bold text-[9px] md:text-[10px] leading-[14px] md:leading-[16px] shadow-md z-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            Popular
          </p>

          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: `.swiper-button-next-${product.id}`,
              prevEl: `.swiper-button-prev-${product.id}`,
            }}
            pagination={{ clickable: true }}
            loop={photos.length > 2}
            slidesPerView={1}
            spaceBetween={0}
            className="h-full w-full swiper-with-animation"
          >
            {photos.map((photo, index) => (
              <SwiperSlide key={index}>
                <div
                  className="w-full h-full relative"
                  onClick={() => openModal(photo)}
                >
                  <img
                    src={photo}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 cursor-zoom-in hover:brightness-110"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}

            {/* Panah Navigasi (Desktop) */}
            <div
              className={`swiper-button-prev swiper-button-prev-${product.id} hidden md:flex absolute left-2 top-1/2 z-10 w-2 h-2 lg:w-2 lg:h-2 bg-base-secondary/90 hover:bg-base-tertiary rounded-full shadow-md items-center justify-center text-pop-primary dark:text-support-light-border-subtle border border-support-subtle transition-all duration-300 hover:scale-110 hover:shadow-lg`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-2 h-2 lg:w-2 lg:h-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </div>
            <div
              className={`swiper-button-next swiper-button-next-${product.id} hidden md:flex absolute right-2 top-1/2 z-10 w-6 h-6 lg:w-2 lg:h-2 bg-base-secondary/90 hover:bg-base-tertiary rounded-full shadow-md items-center justify-center text-pop-primary dark:text-support-light-border-subtle border border-support-subtle transition-all duration-300 hover:scale-110 hover:shadow-lg`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 lg:w-5 lg:h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </Swiper>

          {/* Dot indicator (mobile & desktop) */}
          <div className="swiper-pagination swiper-pagination-bullets !bottom-2 md:!bottom-3"></div>
        </div>

        {/* Detail Produk */}
        <div className="card-detail-container flex flex-col p-2 md:p-3 lg:p-4 pb-3 md:pb-4 lg:pb-5 gap-1.5 md:gap-2 flex-grow transition-all duration-300 group-hover:transform group-hover:translate-y-[-2px]">
          <h3 className="line-clamp-2 font-bold text-sm md:text-md lg:text-sm leading-4 md:leading-5 lg:leading-6 h-[32px] md:h-[40px] lg:h-[48px] text-center text-support-primary transition-all duration-300 group-hover:text-pop-light-hover dark:group-hover:text-pop-dark-hover">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-0.5 md:mt-1">
            <p className="font-semibold text-xs md:text-sm lg:text-base text-pop-primary dark:text-support-light-border-subtle transition-all duration-300 group-hover:scale-105">
              Rp{product.price.toLocaleString("id-ID")}
            </p>
            <div className="flex items-center justify-end gap-0.5 md:gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 stroke-support-tertiary transition-all duration-300 group-hover:scale-110 hover:rotate-6 group-hover:stroke-pop-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-0.5 md:mt-1 gap-1 sm:gap-0">
            <div className="flex items-center gap-0.5 md:gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 stroke-semantic-info flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Zm-12 0h.008v.008H6V10.5Z"
                />
              </svg>
              <span className="font-medium text-[10px] md:text-xs text-support-tertiary truncate">
                {product.category?.name}
              </span>
            </div>
            {product.brand && (
              <div className="flex items-center gap-1 md:gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 stroke-support-secondary flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:stroke-pop-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6h.008v.008H6V6Z"
                  />
                </svg>
                <span className="font-medium text-xs md:text-sm text-support-secondary truncate transition-all duration-300 group-hover:font-semibold group-hover:text-pop-primary">
                  {product.brand.name}
                </span>
              </div>
            )}
          </div>

          <button
            className="mt-2 md:mt-3 w-full rounded-full py-1.5 md:py-2 px-3 md:px-4 bg-pop-primary text-white font-bold text-xs md:text-sm lg:text-sm shadow-lg hover:bg-pop-hover hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-pop-primary"
            tabIndex={0}
            aria-label={`Sewa sekarang produk ${product.name}`}
          >
            Sewa Sekarang
          </button>
        </div>
      </div>

      {/* Modal Zoom */}
      {isModalOpen && (
        <ImageModal
          src={modalImage}
          alt="Zoomed product image"
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
});

export default ProductCard;
