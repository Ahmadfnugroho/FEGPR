// src/components/ProductCard.tsx
import { Product } from "../types/type";
import { memo, useState, useCallback, useEffect } from "react";
import "swiper/swiper-bundle.css";
import { STORAGE_BASE_URL } from "../api/constants";
import { formatPrice } from "../utils/rental-duration-helper";
import { 
  getValidProductPhotoUrls, 
  hasValidProductPhotos,
  validateProduct 
} from "../utils/productValidation";

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
  // Validate product and photos on mount
  const [validatedPhotos, setValidatedPhotos] = useState<string[]>([]);
  const [hasPhotos, setHasPhotos] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validate and process photos when product changes
  useEffect(() => {
    if (!product) {
      console.warn('🚨 [ProductCard] Product is null or undefined');
      setValidatedPhotos(["/images/placeholder-product.png"]);
      setHasPhotos(false);
      setValidationErrors(['Product is null or undefined']);
      return;
    }

    // Validate product structure
    const validation = validateProduct(product);
    if (!validation.isValid) {
      console.warn('🚨 [ProductCard] Product validation failed:', {
        product: product.name,
        errors: validation.errors
      });
      setValidationErrors(validation.errors);
    }

    // Get valid photo URLs
    const validPhotoUrls = getValidProductPhotoUrls(product);
    
    if (validPhotoUrls.length === 0) {
      console.log('📷 [ProductCard] No valid photos found, using placeholder:', product.name);
      setValidatedPhotos(["/images/placeholder-product.png"]);
      setHasPhotos(false);
    } else {
      console.log('📷 [ProductCard] Valid photos found:', {
        product: product.name,
        photoCount: validPhotoUrls.length,
        photos: validPhotoUrls
      });
      setValidatedPhotos(validPhotoUrls);
      setHasPhotos(true);
    }
  }, [product]);

  const openModal = useCallback((img: string) => {
    setModalImage(img);
    setIsModalOpen(true);
  }, []);

  return (
    <div className="card">
      <div
        className="flex flex-col rounded-xl md:rounded-2xl border border-support-subtle bg-base-secondary shadow-md hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group focus-within:ring-2 focus-within:ring-pop-primary cursor-pointer h-[250px] md:h-[300px]"
        tabIndex={0}
        aria-label={`Lihat detail produk ${product.name}`}
      >
        {/* Thumbnail Carousel */}
        <div className="thumbnail-container relative w-full aspect-[4/3] overflow-hidden rounded-t-xl md:rounded-t-2xl">
          {product.premiere == 1 && (
            <div className="absolute top-2 right-2 z-10">
              <span className="inline-block px-1.5 md:px-2 py-1 text-xs font-semibold text-white bg-text-light-primary rounded shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105 group-hover:rotate-3">
                <span className="hidden sm:inline">⭐ Terlaris</span>
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
            loop={validatedPhotos.length > 2}
            slidesPerView={1}
            spaceBetween={0}
            className="h-full w-full swiper-with-animation"
          >
            {validatedPhotos.map((photo, index) => (
              <SwiperSlide key={`${product.id}-photo-${index}`}>
                <div
                  className="w-full h-full relative"
                  onClick={() => openModal(photo)}
                >
                  <img
                    src={photo}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 cursor-zoom-in hover:brightness-110"
                    loading="lazy"
                    onError={(e) => {
                      console.error('📷 [ProductCard] Image load error:', {
                        product: product.name,
                        photo,
                        index
                      });
                      // Fallback to placeholder
                      if (e.currentTarget.src !== "/images/placeholder-product.png") {
                        e.currentTarget.src = "/images/placeholder-product.png";
                      }
                    }}
                  />
                  {/* Photo validation error indicator */}
                  {!hasPhotos && index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded opacity-75">
                      No Photos
                    </div>
                  )}
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
          <h3 className="text-xs md:text-base lg:text-sm text-support-primary mb-1 md:mb-2 line-clamp-2 flex-shrink-0 transition-all duration-300 group-hover:text-navy-blue-800 text-center">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-center mb-2 md:mb-3 flex-shrink-0">
            <div className="text-center">
              <p className=" text-xs md:text-base lg:text-sm text-navy-blue-800 transition-all duration-300 group-hover:scale-105">
                {formatPrice(product.price)}{" "}
                <span className="text-[10px] md:text-xs text-support-tertiary">
                  /hari
                </span>
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
