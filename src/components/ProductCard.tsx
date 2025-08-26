// src/components/ProductCard.tsx
import { Product } from "../types/type";
import { memo, useState } from "react";
import "swiper/swiper-bundle.css";
import { STORAGE_BASE_URL } from "../api/constants";

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
  const photos =
    product.productPhotos?.length > 0
      ? product.productPhotos.map((p) => `${STORAGE_BASE_URL}/${p.photo}`)
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
        className="flex flex-col rounded-xl md:rounded-2xl border border-support-subtle bg-base-secondary shadow-md hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group focus-within:ring-2 focus-within:ring-pop-primary cursor-pointer h-[250px] md:h-auto"
        tabIndex={0}
        aria-label={`Lihat detail produk ${product.name}`}
      >
        {/* Thumbnail Carousel */}
        <div className="thumbnail-container relative w-full aspect-[4/3] overflow-hidden rounded-t-xl md:rounded-t-2xl">
          {product.premiere == 1 && (
            <div className="absolute top-2 right-2 z-10">
              <span className="inline-block px-1.5 md:px-2 py-1 text-xs font-semibold text-white bg-amber-500 rounded shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 group-hover:rotate-3">
                <span className="hidden sm:inline">⭐ Popular</span>
                <span className="sm:hidden">⭐</span>
              </span>
            </div>
          )}

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
          </Swiper>

          {/* Dot indicator (mobile & desktop) */}
          <div className="swiper-pagination swiper-pagination-bullets !bottom-2 md:!bottom-3"></div>
        </div>

        {/* Detail Produk */}
        <div className="p-2 md:p-3 lg:p-4 flex-grow flex flex-col transition-all duration-300 group-hover:transform group-hover:translate-y-[-2px]">
          {/* Title */}
          <h3 className="text-xs md:text-base lg:text-lg text-support-primary mb-1 md:mb-2 line-clamp-2 flex-shrink-0 transition-all duration-300 group-hover:text-navy-blue-800 text-center">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-center mb-2 md:mb-3 flex-shrink-0">
            <div className="text-center">
              <p className=" text-xs md:text-base lg:text-lg text-navy-blue-800 transition-all duration-300 group-hover:scale-105">
                Rp{product.price.toLocaleString("id-ID")}
              </p>
              <p className="text-[10px] md:text-xs text-support-tertiary">
                /hari
              </p>
            </div>
          </div>

          {/* Button */}
          <button
            className="w-full rounded-full py-1.5 md:py-2 bg-text-light-primary text-white font-bold text-xs md:text-sm lg:text-base shadow-lg hover:bg-pop-hover hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-pop-primary mt-auto"
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
