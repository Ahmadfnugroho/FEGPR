import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import NavCard from "../components/navCard";
import { useParams } from "react-router-dom";
import { MdOutlineCamera } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type {
  Bundling,
  BundlingProduct,
  ProductPhoto,
  productSpecification,
  RentalInclude,
} from "../types/type";
import FooterSection from "../components/FooterSection";

const fetchBundling = async (slug: string | undefined) => {
  if (!slug) throw new Error("No slug provided");
  const { data } = await axios.get(`http://gpr.id/api/bundling/${slug}`, {
    headers: {
      "X-API-KEY": "gbTnWu4oBizYlgeZ0OPJlbpnG11ARjsf",
    },
  });
  return data.data as Bundling;
};

export default function BundlingDetails() {
  const { slug } = useParams<{ slug: string }>();
  const baseURL = "http://gpr.id/storage";

  const {
    data: bundling,
    isLoading,
    isError,
    error,
  } = useQuery<Bundling, Error>({
    queryKey: ["bundling", slug],
    queryFn: () => fetchBundling(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="max-w-[1130px] mx-auto mt-24 p-6 animate-pulse">
        <div className="h-10 bg-light dark:bg-dark rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-light dark:bg-dark rounded w-1/2 mb-6"></div>
        <div className="h-48 bg-light dark:bg-dark rounded mb-6"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 p-6">Error: {error?.message}</p>
    );
  }

  if (!bundling) {
    return <p className="text-center p-6">Bundling tidak ditemukan</p>;
  }

  // Get all photos from all products in the bundling
  const allPhotos: (ProductPhoto & { productName: string })[] = [];
  bundling.products.forEach((product) => {
    product.productPhotos?.forEach((photo) => {
      allPhotos.push({
        ...photo,
        productName: product.name,
      });
    });
  });

  // WhatsApp link with bundling info
  const whatsappLink = `https://wa.me/6281212349564?text=Halo%20kak%2C%20saya%20mau%20sewa%20bundling%20${encodeURIComponent(
    bundling.name
  )}`;

  return (
    <>
      <NavCard />
      <main className="max-w-[1130px] mx-auto px-6 pb-24 pt-24 scroll-fade-in">
        {/* Grid: Gambar + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start scroll-fade-in" data-delay="100">
          {/* Kolom 1: Swiper */}
          <div className="lg:col-span-3 flex flex-col">
            <div
              className="relative flex flex-col h-full"
              style={{ minHeight: 0 }}
            >
              <div
                className="w-full flex items-start scroll-fade-in"
                style={{ paddingBottom: "24px", transition: "padding 0.3s" }}
                data-delay="200"
              >
                {allPhotos.length > 0 ? (
                  <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={10}
                    slidesPerView={1}
                    loop={allPhotos.length > 2}
                    navigation
                    pagination={{ clickable: true }}
                    className="rounded-xl overflow-hidden shadow-lg w-full"
                    style={{
                      maxHeight: "350px",
                      transition: "max-height 0.3s",
                    }}
                  >
                    {allPhotos.map((photo, index) => (
                      <SwiperSlide key={`${photo.id}-${index}`}>
                        <div
                          className="w-full flex items-start justify-center bg-light dark:bg-dark-light overflow-hidden"
                          style={{
                            maxHeight: "350px",
                            minHeight: "200px",
                            transition: "max-height 0.3s",
                          }}
                        >
                          <img
                            src={`${baseURL}/${photo.photo}`}
                            alt={`Foto ${photo.productName}`}
                            className="object-contain max-h-[350px] w-auto h-auto transition-all duration-300"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "350px",
                              minHeight: "200px",
                            }}
                            loading="lazy"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="w-full h-[300px] bg-light dark:bg-dark-light rounded-xl flex items-center justify-center">
                    <p className="text-muted dark:text-muted-dark">
                      Tidak ada foto tersedia
                    </p>
                  </div>
                )}
              </div>

              {/* Produk dalam Bundling */}
              <div className="pt-4 border-t border-light dark:border-dark scroll-fade-in" data-delay="300">
                <h2 className="font-bold text-lg mb-4 scroll-fade-in" data-delay="400">Produk dalam Paket</h2>
                <div className="space-y-6 stagger-fade-in" data-staggerdelay="100">
                  {bundling.products.map((product: BundlingProduct, index) => (
                    <div
                      key={product.id}
                      className="border border-light dark:border-dark rounded-lg p-4 stagger-item"
                      data-index={index}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-dark dark:text-light">
                            {product.quantity > 1 && `${product.quantity}x `}
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted dark:text-muted-dark">
                            {product.category && (
                              <span>{product.category.name}</span>
                            )}
                            {product.brand && (
                              <>
                                <span>•</span>
                                <span>{product.brand.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">
                            Rp{product.price.toLocaleString("id-ID")}
                          </p>
                          <p className="text-xs text-muted dark:text-muted-dark">
                            /hari
                          </p>
                        </div>
                      </div>

                      {/* Rental Includes for this product */}
                      <div className="mt-3">
                        <h4 className="font-medium text-sm mb-2">Termasuk:</h4>
                        <div className="space-y-1">
                          {product.rentalIncludes &&
                          product.rentalIncludes.length > 0 ? (
                            product.rentalIncludes.map(
                              (include: RentalInclude) => (
                                <div
                                  key={include.id}
                                  className="flex items-center text-xs text-muted dark:text-muted-dark"
                                >
                                  <span className="w-1 h-1 bg-secondary-light rounded-full mr-2"></span>
                                  <span>
                                    {include.quantity &&
                                      parseInt(include.quantity) > 1 &&
                                      `${include.quantity}x `}
                                    {include.included_product?.name ||
                                      "Item tidak diketahui"}
                                  </span>
                                </div>
                              )
                            )
                          ) : (
                            <div className="flex items-center text-xs text-muted dark:text-muted-dark">
                              <span className="w-1 h-1 bg-secondary-light rounded-full mr-2"></span>
                              <span>{product.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Specifications */}
                      {product.productSpecifications &&
                        product.productSpecifications.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-light dark:border-dark">
                            <h4 className="font-medium text-sm mb-2">
                              Spesifikasi:
                            </h4>
                            <div className="text-xs text-muted dark:text-muted-dark">
                              {product.productSpecifications[0]?.name
                                ?.split("\n")
                                .slice(0, 3)
                                .map((line, i) => (
                                  <p key={i} className="truncate">
                                    {line.trim()}
                                  </p>
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Kolom 2: Info Bundling */}
          <div className="lg:col-span-2 scroll-fade-in" data-delay="200">
            <div
              className="flex flex-col h-full justify-between"
              style={{ minHeight: "350px", maxHeight: "350px" }}
            >
              {/* Atas */}
              <div className="mb-4 scroll-fade-in" data-delay="300">
                <span className="inline-block rounded-full px-3 py-2 font-bold text-lg text-center text-white bg-blue-600 mb-4">
                  📦 Bundling Package
                </span>
                {bundling.premiere && (
                  <span className="inline-block rounded-full px-3 py-1 font-semibold text-sm text-white bg-amber-500 ml-2">
                    ⭐ Rekomendasi
                  </span>
                )}
              </div>

              {/* Tengah */}
              <div className="flex flex-col gap-5 mb-5 scroll-fade-in" data-delay="400">
                <h1 className="font-extrabold text-3xl lg:text-4xl">
                  {bundling.name}
                </h1>
                <div className="flex items-center text-lg text-muted dark:text-muted-dark">
                  <span className="font-semibold">
                    {bundling.products.length} produk dalam paket
                  </span>
                </div>
                <p className="font-extrabold text-3xl text-dark dark:text-white">
                  Rp{bundling.price.toLocaleString("id-ID")} /hari
                </p>
                <div className="text-sm text-muted dark:text-muted-dark">
                  <p className="mb-1">💰 Hemat dibanding sewa terpisah:</p>
                  <p className="font-semibold text-green-600">
                    Rp
                    {(
                      bundling.products.reduce(
                        (total, product) =>
                          total + product.price * product.quantity,
                        0
                      ) - bundling.price
                    ).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Bawah */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-full py-3 px-6 gap-3 bg-accent hover:bg-accent-dark text-white font-bold transition-all duration-300 shadow-lg scroll-fade-in"
                data-delay="500"
              >
                <MdOutlineCamera className="w-5 h-5" />
                <span className="text-2xl">Pesan via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
