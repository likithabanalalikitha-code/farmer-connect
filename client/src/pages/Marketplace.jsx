import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Sprout, Sparkles } from 'lucide-react';
import { productService } from '../services/productService';
import SearchBar from '../components/marketplace/SearchBar';
import FilterPanel from '../components/marketplace/FilterPanel';
import ProductGrid from '../components/marketplace/ProductGrid';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Derive filter state from URL params
  const currentFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    organic: searchParams.get('organic') === 'true' ? true : searchParams.get('organic') === 'false' ? false : '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    location: searchParams.get('location') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page'), 10) || 1
  };

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {};
      if (currentFilters.search) params.search = currentFilters.search;
      if (currentFilters.category && currentFilters.category !== 'All') params.category = currentFilters.category;
      if (currentFilters.organic !== '') params.organic = currentFilters.organic;
      if (currentFilters.minPrice) params.minPrice = currentFilters.minPrice;
      if (currentFilters.maxPrice) params.maxPrice = currentFilters.maxPrice;
      if (currentFilters.location) params.location = currentFilters.location;
      if (currentFilters.sort) params.sort = currentFilters.sort;
      params.page = currentFilters.page;
      params.limit = 12;

      const res = await productService.getProducts(params);
      setProducts(res.data || []);
      if (res.meta) {
        setPagination(res.meta);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch produce from marketplace.');
    } finally {
      setIsLoading(false);
    }
  }, [
    currentFilters.search,
    currentFilters.category,
    currentFilters.organic,
    currentFilters.minPrice,
    currentFilters.maxPrice,
    currentFilters.location,
    currentFilters.sort,
    currentFilters.page
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = (newFilters) => {
    const nextParams = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      const val = newFilters[key];
      if (val !== undefined && val !== '' && val !== null && val !== 'All') {
        nextParams.set(key, val);
      }
    });
    setSearchParams(nextParams);
  };

  const handleSearch = (query) => {
    updateFilters({ ...currentFilters, search: query, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateFilters({ ...currentFilters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-earth-200 dark:border-earth-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-600 dark:text-forest-400 flex items-center gap-1.5 mb-1">
            <Sprout className="w-3.5 h-3.5" />
            Direct Agricultural Exchange
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-900 dark:text-white tracking-tight">
            Agricultural Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-earth-500 dark:text-earth-400">
            Browse verified crops, vegetables, grains, and spices directly from verified growers across India.
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            icon={SlidersHorizontal}
            onClick={() => setMobileFilterOpen(true)}
            className="w-full"
          >
            Filters ({pagination.total || 0})
          </Button>
        </div>
      </div>

      {/* Search Header Bar */}
      <div className="max-w-2xl">
        <SearchBar
          initialValue={currentFilters.search}
          onSearch={handleSearch}
          placeholder="Search produce (e.g. Tomatoes, Basmati Rice, Alphonso Mangoes, Turmeric)..."
        />
      </div>

      {/* Main 2-Column Marketplace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24">
          <FilterPanel
            filters={currentFilters}
            onChange={updateFilters}
            onReset={handleResetFilters}
            totalResults={pagination.total}
          />
        </aside>

        {/* Product Cards Grid Section */}
        <main className="lg:col-span-8 xl:col-span-9">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            error={error}
            onRetry={fetchProducts}
            pagination={pagination}
            onPageChange={handlePageChange}
            onResetFilters={handleResetFilters}
          />
        </main>
      </div>

      {/* Mobile Filters Modal */}
      <Modal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter Agricultural Produce"
      >
        <FilterPanel
          filters={currentFilters}
          onChange={updateFilters}
          onReset={handleResetFilters}
          totalResults={pagination.total}
          isMobile={true}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Marketplace;
