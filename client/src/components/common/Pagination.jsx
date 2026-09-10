import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    // Show first, last, current, and neighbours
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-earth-300 dark:border-earth-700 bg-white dark:bg-earth-900 text-earth-700 dark:text-earth-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page, idx) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="px-3 py-1 text-sm text-earth-400"
            >
              ...
            </span>
          );
        }
        const isActive = page === currentPage;
        return (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page)}
            className={`
              w-9 h-9 text-sm font-medium rounded-xl transition-all
              ${
                isActive
                  ? 'bg-forest-600 text-white shadow-sm'
                  : 'bg-white dark:bg-earth-900 border border-earth-300 dark:border-earth-700 text-earth-700 dark:text-earth-300 hover:bg-earth-100 dark:hover:bg-earth-800'
              }
            `}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-earth-300 dark:border-earth-700 bg-white dark:bg-earth-900 text-earth-700 dark:text-earth-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
