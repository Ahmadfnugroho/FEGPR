import { Category } from "../types/type";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const baseURL = "http://gpr.id/storage";

  // Responsive card sizes
  const cardVariants = [
    {
      visible: "md:hidden",
      width: "w-36",
      height: "h-36",
      text: "text-xs",
    },
    {
      visible: "hidden md:block",
      width: "w-[230px]",
      height: "h-[300px]",
      text: "text-sm",
    },
  ];

  return (
    <>
      {cardVariants.map((variant, _idx) => (
        <div className={`card ${variant.visible}`} key={variant.visible}>
          <div
            className={`relative flex shrink-0 ${variant.width} ${variant.height} rounded-2xl ring-1 ring-light dark:ring-dark overflow-hidden text-center shadow-md hover:shadow-xl transition-all duration-300 group focus-within:ring-2 focus-within:ring-primary cursor-pointer focus-visible:outline-none`}
            tabIndex={0}
            aria-label={`Lihat kategori ${category.name}`}
            role="button"
          >
            <div className="relative flex flex-col justify-end w-full h-full p-5 gap-1 bg-[linear-gradient(180deg,_rgba(0,0,0,0)_49.87%,_rgba(0,0,0,0.8)_100%)] z-10">
              <h3
                className={`font-semibold ${variant.text} text-white drop-shadow-md`}
              >
                {category.name}
              </h3>
            </div>
            <img
              src={`${baseURL}/${category.photo}`}
              className="absolute w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              alt={`Kategori ${category.name}`}
              loading="lazy"
              draggable={false}
            />
          </div>
        </div>
      ))}
    </>
  );
}
