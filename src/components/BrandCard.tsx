import { Brand } from "../types/type";
import { memo } from "react";

const BrandCard = memo(function BrandCard({ brand }: BrandCardProps) {
  const baseURL = "http://gpr.test/storage";

  return (
    <div>
      <img
        src={`${baseURL}/${brand.logo}`}
        alt="brands logo"
        className="md:h-9 h-4 w-auto bg-transparent"
        loading="lazy"
      />
    </div>
  );
});
export default BrandCard;

interface BrandCardProps {
  brand: Brand;
}
