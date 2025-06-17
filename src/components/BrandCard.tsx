import { Brand } from "../types/type";

export default function BrandCard({ brand }: BrandCardProps) {
  const baseURL = "http://gpr.test/storage";

  return (
    <div>
      <img
        src={`${baseURL}/${brand.logo}`}
        alt="brands logo"
        className="md:h-9 h-4 w-auto  bg-transparent md:px-7px-5"
      />
    </div>
  );
}
interface BrandCardProps {
  brand: Brand;
}
