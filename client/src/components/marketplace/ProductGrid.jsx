import React from 'react';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import Pagination from '../common/Pagination';

const ProductGrid = ({
  products = [],
  isLoading = false,
  error = null,
  onRetry,
  pagination = null,
  onPageChange,
  onResetFilters
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Could not load marketplace produce"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No agricultural products found"
        description="Try adjusting your search terms, removing organic filters, or expanding your price range."
        actionLabel="Clear All Filters"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ProductGrid;
