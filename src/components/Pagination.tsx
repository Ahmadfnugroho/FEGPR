import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { memo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = memo(function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = '' 
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5; // Maximum number of visible page buttons
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      if (currentPage <= 3) {
        // Show first few pages
        pages.push(1, 2, 3, 4);
        if (totalPages > 4) pages.push(-1); // -1 represents ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last few pages
        pages.push(1);
        if (totalPages > 4) pages.push(-1);
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Show middle pages
        pages.push(1);
        pages.push(-1);
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push(-1);
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center gap-1 mt-6 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`
          flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200
          ${currentPage === 1 
            ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50' 
            : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200'
          }
        `}
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === -1) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-8 h-8 text-gray-400"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-medium transition-all duration-200
                ${page === currentPage
                  ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200'
                }
              `}
              aria-label={`Halaman ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`
          flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200
          ${currentPage === totalPages 
            ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50' 
            : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200'
          }
        `}
        aria-label="Halaman selanjutnya"
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
});

export default Pagination;
