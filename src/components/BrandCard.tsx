import { Brand } from "../types/type";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

const BrandCard = memo(function BrandCard({ brand }: BrandCardProps) {
  const baseURL = "https://gpr-b5n3q.sevalla.app/storage";
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products?brand=${brand.id}`);
  };

  return (
    <button
      type="button"
      className="bg-white dark:bg-[#2c2f36] rounded-lg md:rounded-xl shadow-sm hover:shadow-md flex items-center justify-center p-3 md:p-4 lg:p-6 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary border border-light dark:border-dark h-16 md:h-20 lg:h-24"
      onClick={handleClick}
      aria-label={`Lihat produk brand ${brand.name}`}
    >
      <img
        src={`${baseURL}/${brand.logo}`}
        alt={`Logo ${brand.name}`}
        className="max-h-[20px] md:max-h-[32px] lg:max-h-[40px] w-auto object-contain"
        loading="lazy"
        draggable={false}
      />
    </button>
  );
});
export default BrandCard;

interface BrandCardProps {
  brand: Brand;
}
