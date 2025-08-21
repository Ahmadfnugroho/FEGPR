import { useMemo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MdOutlineCamera, MdArrowBack, MdError } from "react-icons/md";

import type {
  Product,
  ProductPhoto,
  productSpecification,
  RentalInclude,
} from "../types/type";

import NavCard from "../components/navCard";
import FooterSection from "../components/FooterSection";
import FullScreenLoader from "../components/FullScreenLoader";

// Constants
const API_BASE_URL = "https://gpr-b5n3q.sevalla.app/api";
const STORAGE_BASE_URL = "https://gpr-b5n3q.sevalla.app/storage";
const API_KEY = "gbTnWu4oBizYlgeZ0OPJlbpnG11ARjsf";
const WHATSAPP_NUMBER = "6281212349564";

// --- API HELPER ---
const fetchProduct = async (slug: string | undefined): Promise<Product> => {
  if (!slug) throw new Error("Slug produk tidak ditemukan");

  const { data } = await axios.get<{ data: Product }>(
    `${API_BASE_URL}/product/${slug}`,
    { headers: { "X-API-KEY": API_KEY }, timeout: 10000 }
  );

  if (!data?.data) throw new Error("Produk tidak ditemukan");
  return data.data;
};

// --- SUB COMPONENTS ---
const ProductImageGallery = ({
  productName,
  photos,
}: {
  productName: string;
  photos: ProductPhoto[];
}) => {
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.src = "/assets/images/placeholder.jpg";
    },
    []
  );

  if (!photos?.length) {
    return (
      <div className="lg:col-span-3">
        <div className="w-full h-[250px] md:h-[350px] lg:h-[450px] rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <div className="text-center">
            <MdError className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <span className="text-gray-500 dark:text-gray-400">
              Tidak ada gambar tersedia
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        loop={photos.length > 2}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        className="w-full h-[100px] md:h-[200px] lg:h-[300px] rounded-xl overflow-hidden shadow-lg"
        aria-label={`Galeri foto ${productName}`}
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={photo.id}>
            <div className="w-full h-full  flex items-center justify-center bg-light dark:bg-dark-light">
              <img
                src={`${STORAGE_BASE_URL}/${photo.photo}`}
                alt={`Foto ${productName} ${index + 1}`}
                className="object-contain w-full h-full transition-opacity duration-300"
                loading={index === 0 ? "eager" : "lazy"}
                onError={handleImageError}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const ProductInfo = ({ product }: { product: Product }) => {
  const whatsappLink = useMemo(() => {
    const message = `Halo, saya tertarik untuk menyewa ${product.name}. Bisa beri info lebih lanjut?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
  }, [product.name]);

  const categoryItems = useMemo(
    () =>
      [product.category, product.subCategory, product.brand]
        .filter(Boolean)
        .map((item) => item?.name)
        .filter(Boolean),
    [product.category, product.subCategory, product.brand]
  );

  const isAvailable = product.status === "available";
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="lg:col-span-2 flex flex-col gap-6">
      <span
        className={`inline-block rounded-full px-4 py-2 text-sm font-bold text-white ${
          isAvailable ? "bg-green-600" : "bg-red-600"
        }`}
        role="status"
      >
        {isAvailable ? "✓ Tersedia" : "✗ Tidak Tersedia"}
      </span>

      <header>
        <h1 className="font-extrabold text-3xl lg:text-4xl text-dark dark:text-white leading-tight">
          {product.name}
        </h1>

        {categoryItems.length > 0 && (
          <nav
            className="flex flex-wrap items-center gap-x-2 gap-y-1 text-md text-muted mt-2"
            aria-label="Kategori produk"
          >
            {categoryItems.map((item, index) => (
              <span key={index} className="font-semibold">
                {item}
                {index < categoryItems.length - 1 && (
                  <span className="mx-1 text-gray-400">•</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </header>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <p className="font-extrabold text-3xl text-dark dark:text-white">
          {formattedPrice}
          <span className="text-lg font-normal text-muted ml-1">/hari</span>
        </p>
      </div>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center rounded-full py-4 px-6 gap-3 font-bold text-lg transition-all duration-300 shadow-lg ${
          isAvailable
            ? "bg-accent hover:bg-accent-dark text-white"
            : "bg-gray-400 text-gray-600 cursor-not-allowed"
        }`}
        {...(!isAvailable && { "aria-disabled": "true", tabIndex: -1 })}
      >
        <MdOutlineCamera className="w-6 h-6" aria-hidden="true" />
        <span>{isAvailable ? "Pesan via WhatsApp" : "Tidak Tersedia"}</span>
      </a>
    </div>
  );
};

const ProductSpecifications = ({
  specifications,
}: {
  specifications: productSpecification[];
}) => {
  const specLines = useMemo(() => {
    if (!specifications?.length) return [];
    return specifications[0].name
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => ({
        id: index,
        text: line,
        isHeader: line.includes(":") && !line.startsWith("•"),
      }));
  }, [specifications]);

  if (!specLines.length) return null;

  return (
    <section className="lg:col-span-3 pt-6 border-t border-light dark:border-dark">
      <h2 className="font-bold text-2xl mb-4 text-dark dark:text-white">
        Spesifikasi Produk
      </h2>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <dl className="space-y-3 text-muted leading-relaxed">
          {specLines.map((spec) => (
            <div key={spec.id} className="flex items-start gap-3">
              {!spec.isHeader && (
                <span className="text-accent mt-1.5 text-sm">•</span>
              )}
              <dd
                className={`flex-1 ${
                  spec.isHeader
                    ? "font-semibold text-dark dark:text-white"
                    : "text-sm"
                }`}
              >
                {spec.text}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

const RentalIncludes = ({
  productName,
  includes,
}: {
  productName: string;
  includes: RentalInclude[];
}) => {
  const includeItems = useMemo(() => {
    if (!includes?.length) {
      return [{ id: "default", name: productName, quantity: 1 }];
    }
    return includes.map((item) => ({
      id: item.id,
      name: item.included_product?.name || "Item tidak diketahui",
      quantity: item.quantity ? parseInt(item.quantity, 10) : 1,
    }));
  }, [includes, productName]);

  return (
    <section className="lg:col-span-2 pt-6 border-t border-light dark:border-dark">
      <h2 className="font-bold text-2xl mb-4 text-dark dark:text-white">
        Termasuk Dalam Sewa
      </h2>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <ul className="space-y-3 text-muted">
          {includeItems.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <span className="text-accent mt-1.5 text-sm">✓</span>
              <span className="flex-1 text-sm">
                {item.quantity > 1 && (
                  <span className="font-semibold text-accent mr-1">
                    {item.quantity}x
                  </span>
                )}
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

// --- MAIN COMPONENT ---
export default function Details() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    staleTime: 10 * 60 * 1000, // fresh 10 menit
    gcTime: 30 * 60 * 1000, // cache hilang setelah 30 menit idle
  });

  if (isLoading) return <FullScreenLoader />;

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <MdError className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error instanceof Error ? error.message : "Produk Tidak Ditemukan"}
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => refetch()}
              className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Coba Lagi
            </button>
            <Link
              to="/"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
            >
              <MdArrowBack className="inline mr-2" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavCard />
      <main className="max-w-[1130px] mx-auto px-4 sm:px-6 pb-24 pt-28">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-muted">
            <li>
              <Link to="/" className="hover:text-accent transition-colors">
                Beranda
              </Link>
            </li>
            <li className="mx-2">/</li>
            {product.category ? (
              <li>
                <Link
                  to={`/category/${product.category.slug || ""}`}
                  className="text-accent font-semibold hover:underline"
                >
                  {product.category.name}
                </Link>
              </li>
            ) : (
              <li>
                <span className="text-gray-500">Tanpa Kategori</span>
              </li>
            )}
            <li
              className="text-dark dark:text-white font-medium"
              aria-current="page"
            >
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-8 gap-y-10 items-start">
          <ProductImageGallery
            productName={product.name}
            photos={product.productPhotos || []}
          />
          <ProductInfo product={product} />
          <ProductSpecifications
            specifications={product.productSpecifications || []}
          />
          <RentalIncludes
            productName={product.name}
            includes={product.rentalIncludes || []}
          />
        </div>
      </main>
      <FooterSection />
    </>
  );
}
