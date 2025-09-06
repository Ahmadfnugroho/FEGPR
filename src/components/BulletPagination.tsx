import { memo } from 'react';

interface BulletPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const BulletPagination = memo(function BulletPagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = '' 
}: BulletPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center gap-2 mt-6 ${className}`}>
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-3 h-3 rounded-full transition-all duration-300 cursor-pointer
              ${page === currentPage
                ? 'bg-primary shadow-md scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
              }
            `}
            aria-label={`Halaman ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          />
        );
      })}
    </div>
  );
});

export default BulletPagination;
