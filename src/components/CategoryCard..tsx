import { Category } from "../types/type";

export default function CategoryCard({ category }: CategoryCardProps) {
  const baseURL = "http://gpr.test/storage";
  return (
    <>
      <div className="card md:hidden">
        <div className="relative flex shrink-0 w-36 h-36 rounded-2xl ring-1 rong-gray-100 overflow-hidden text-center transition-all duration-200 hover:ring-2 hover:ring-primary">
          <div className="relative flex flex-col justify-end w-full h-full p-5 gap-[2px] bg-[linear-gradient(180deg,_rgba(0,0,0,0)_49.87%,_rgba(0,0,0,0.8)_100%)] z-10">
            <h3 className="font-semibold text-xs text-white">
              {category.name}
            </h3>
            {/* <p className="text-white">{category.products_count} Alat </p> */}
          </div>
          <img
            src={`${baseURL}/${category.photo}`}
            className="absolute w-full h-full object-cover"
            alt="thumbnails"
          />
        </div>
      </div>
      <div className="card hidden md:block">
        <div className="relative flex shrink-0 w-[230px] h-[300px] rounded-[20px] overflow-hidden ring-1 ring-gray-100 dark:ring-gray-900 text-center transition-all duration-200 hover:ring-2 hover:ring-primary">
          <div className="relative flex flex-col justify-end w-full h-full p-5 gap-[2px] bg-[linear-gradient(180deg,_rgba(0,0,0,0)_49.87%,_rgba(0,0,0,0.8)_100%)] z-10">
            <h3 className="font-semibold text-sm text-white">
              {category.name}
            </h3>
            {/* <p className="text-white">{category.products_count} Alat </p> */}
          </div>
          <img
            src={`${baseURL}/${category.photo}`}
            className="absolute w-full h-full object-cover"
            alt="thumbnails"
          />
        </div>
      </div>
    </>
  );
}

interface CategoryCardProps {
  category: Category;
}
