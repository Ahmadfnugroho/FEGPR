import { Swiper, SwiperSlide } from "swiper/react";
import NavCard from "../components/navCard";
import { useParams, Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { SlSocialFacebook } from "react-icons/sl";
import { GrCart } from "react-icons/gr";
import { MdOutlineCamera } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type {
  Product,
  ProductPhoto,
  productSpecification,
  RentalInclude,
} from "../types/type";

const fetchProduct = async (slug: string | undefined) => {
  if (!slug) throw new Error("No slug provided");
  const { data } = await axios.get(`http://gpr.test/api/product/${slug}`, {
    headers: {
      "X-API-KEY": "6cNWymcs6W094LdZm9pa326lGlS4rEYx",
    },
  });
  return data.data as Product;
};

export default function Details() {
  const { slug } = useParams<{ slug: string }>();
  const baseURL = "http://gpr.test/storage";
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery<Product, Error>({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    // Skeleton loader sederhana
    return (
      <div className="max-w-[1130px] mx-auto mt-10 animate-pulse">
        <div className="h-[550px] bg-gray-200 rounded mb-6" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Error: {error?.message}</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <>
      <NavCard />
      <section id="Gallery" className="-mb-[50px]">
        <div className="swiper w-full">
          <Swiper
            direction="horizontal"
            spaceBetween={3}
            slidesPerView="auto"
            slidesOffsetAfter={3}
            slidesOffsetBefore={3}
          >
            {product?.productPhotos?.map((photo: ProductPhoto) => (
              <SwiperSlide key={photo.id} className="swiper-slide !w-fit">
                <div className="w-[700px] h-[550px] overflow-hidden">
                  <img
                    src={`${baseURL}/${photo.photo}`}
                    className="w-full h-full object-cover"
                    alt={`Foto produk ${product.name}`}
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <section
        id="Details"
        className="relative flex max-w-[1130px] mx-auto gap-[30px] mb-20 z-10"
      >
        <div className="flex flex-col w-full rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
          <p
            className={`w-fit rounded-full p-[6px_16px] font-bold text-sm leading-[21px] text-[#F7F7FD] ${
              product.status === "available" ? "bg-secondary" : "bg-red-500"
            }`}
          >
            {product.status}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-extrabold text-[32px] leading-[44px]">
                {product?.name}
              </h1>
              <div className="flex items-center gap-[6px] mt-[10px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  className="size-6 stroke-secondary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                  />
                </svg>
                <p className="font-semibold">{product.category.name}</p>
                {product.subCategory && (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      className="size-6 stroke-secondary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                      />
                    </svg>

                    <p className="font-semibold">{product.subCategory.name}</p>
                  </>
                )}
                {product.brand && (
                  <div className="flex items-center justify-end gap-[6px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      className="size-6 stroke-secondary"
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
                    <p className="font-semibold">{product.brand.name}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center gap-1">
                {product.quantity > 0 ? (
                  <p className="font-bold text-xl">Sisa: {product.quantity}</p>
                ) : (
                  <p className="font-bold text-xl text-red-600">
                    Produk Tidak Tersedia
                  </p>
                )}
              </div>
            </div>
          </div>
          <p className="leading-[30px]">{product.description}</p>
          <hr className="border-[#F6F5FD]" />
          <h2 className="font-bold text-xl">Spesifikasi Produk</h2>

          <div className=" gap-x-5 gap-y-[30px]">
            <div className="flex items-center gap-4">
              <div className="grid grid-cols-2  gap-[7px]">
                {product.productSpecifications.map(
                  (spec: productSpecification) => (
                    <p
                      key={spec.id}
                      className="font-semibold text-lg flex justify items-start gap-x-2"
                    >
                      <span>&bull;</span>
                      <span>{spec.name}</span>
                    </p>
                  )
                )}
              </div>
            </div>
          </div>

          <hr className="border-[#F6F5FD]" />
          <div className="flex flex-col gap-[6px]">
            <h2 className="font-bold">Alamat Pengambilan</h2>
            <p>Global Photo Rental</p>
            <p>
              Jl. Kepu Sel. No.11A 3, RT.3/RW.3 10460 Daerah Khusus Ibukota
              Jakarta{" "}
            </p>
          </div>
          <div className="overflow-hidden w-full h-[280px]">
            <div
              id="my-map-display"
              className="h-full w-full max-w-[none] bg-none"
            >
              <iframe
                className="h-full w-full border-0"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15866.871702864491!2d106.8439828!3d-6.1685137!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f59ab7791adb%3A0xbd23ce14a107aee2!2sGlobal%20Photo%20Rental!5e0!3m2!1sid!2sid!4v1711423981245!5m2!1sid!2sid"
              />
            </div>
          </div>
        </div>
        <div className="w-[392px] flex flex-col shrink-0 gap-[30px]">
          <div className="flex flex-col rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[30px] bg-white">
            <div>
              <p className="font-extrabold text-[32px] leading-[48px] text-dark">
                Rp{product.price.toLocaleString("id-ID")}
              </p>
              <p className="font-semibold mt-1">/Hari</p>
            </div>
            <hr className="border-[#F6F5FD]" />
            <div className="flex flex-col gap-5">
              <div className=" gap-x-5 gap-y-[30px]">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-[2px]">
                    <h3 className="font-bold text-xl">Rental Includes</h3>
                    {product.rentalIncludes.map((include: RentalInclude) => (
                      <p key={include.id} className="font-semibold text-lg">
                        {include.includedProduct.name}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <hr className="border-[#F6F5FD]" />
            <div className="flex flex-col gap-[14px]">
              <Link
                to={`/product/${slug}/book`}
                className="flex items-center justify-center w-full rounded-full p-[16px_26px] gap-3 bg-[#0D903A] font-bold text-[#F7F7FD]"
              >
                <MdOutlineCamera className="w-6 h-6" />

                <span>Sewa Sekarang</span>
              </Link>
              <button className="flex items-center justify-center w-full rounded-full border border-[#000929] p-[16px_26px] gap-3 bg-white font-semibold">
                <GrCart className="w-6 h-6" />

                <span>Masukkan Keranjang</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col rounded-[20px] border border-[#E0DEF7] p-[30px] gap-[20px] bg-white">
            <h2 className="font-bold">Kontak Kami</h2>
            <div className="flex flex-col gap-[30px]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-[2px]">
                    <p className="font-bold">Global Photo Rental</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link to="https://api.whatsapp.com/message/RKVS5KQ7NXZFJ1?autoload=1&app_absent=0">
                    <span>
                      <FaWhatsapp className="w-8 h-8" />
                    </span>
                  </Link>
                  <Link to="https://www.instagram.com/global.photorental/">
                    <span>
                      <FaInstagram className="w-8 h-8" />
                    </span>
                  </Link>
                  <Link to="https://www.facebook.com/global.photorental">
                    <span>
                      <SlSocialFacebook className="w-8 h-8 color-white" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
