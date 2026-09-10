import React from 'react';
import { Filter, RotateCcw, Sprout, Check } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import Button from '../common/Button';

const FilterPanel = ({
  filters,
  onChange,
  onReset,
  totalResults,
  isMobile = false,
  onCloseMobile
}) => {
  const handleCategoryChange = (cat) => {
    onChange({ ...filters, category: cat, page: 1 });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value, page: 1 });
  };

  const handleOrganicToggle = () => {
    const currentVal = filters.organic;
    const newVal = currentVal === true ? '' : true;
    onChange({ ...filters, organic: newVal, page: 1 });
  };

  const handleLocationChange = (e) => {
    onChange({ ...filters, location: e.target.value, page: 1 });
  };

  const handleSortChange = (e) => {
    onChange({ ...filters, sort: e.target.value, page: 1 });
  };

  return (
    <div className="bg-white dark:bg-earth-900 rounded-3xl border border-earth-200/80 dark:border-earth-800/80 p-5 shadow-subtle space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-earth-100 dark:border-earth-800">
        <div className="flex items-center gap-2 text-earth-900 dark:text-white font-bold text-base">
          <Filter className="w-4 h-4 text-forest-600" />
          <span>Filters</span>
          {totalResults !== undefined && (
            <span className="text-xs font-normal text-earth-500">
              ({totalResults} items)
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-earth-500 hover:text-forest-600 dark:hover:text-forest-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-earth-700 dark:text-earth-300">
          Sort By
        </label>
        <select
          value={filters.sort || 'newest'}
          onChange={handleSortChange}
          className="w-full text-xs rounded-xl border border-earth-300 dark:border-earth-700 bg-earth-50 dark:bg-earth-800 py-2.5 px-3 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
        >
          <option value="newest">Newest Harvests First</option>
          <option value="price-low">Price: Low to High (₹)</option>
          <option value="price-high">Price: High to Low (₹)</option>
          <option value="name-asc">Alphabetical (A - Z)</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-earth-700 dark:text-earth-300">
          Crop Categories
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = (filters.category || 'All') === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  isSelected
                    ? 'bg-forest-600 text-white shadow-sm'
                    : 'bg-earth-100 dark:bg-earth-800 text-earth-700 dark:text-earth-300 hover:bg-earth-200 dark:hover:bg-earth-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Organic Only Filter */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleOrganicToggle}
          className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
            filters.organic
              ? 'bg-forest-50 dark:bg-forest-950/60 border-forest-500 text-forest-900 dark:text-forest-200 font-semibold'
              : 'border-earth-200 dark:border-earth-800 text-earth-700 dark:text-earth-300 hover:bg-earth-50 dark:hover:bg-earth-800'
          }`}
        >
          <div className="flex items-center gap-2 text-xs">
            <Sprout className={`w-4 h-4 ${filters.organic ? 'text-forest-600' : 'text-earth-400'}`} />
            <span>Organic Certified Only</span>
          </div>
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
              filters.organic
                ? 'bg-forest-600 border-forest-600 text-white'
                : 'border-earth-300 dark:border-earth-700'
            }`}
          >
            {filters.organic && <Check className="w-3.5 h-3.5" />}
          </div>
        </button>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-earth-700 dark:text-earth-300">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice || ''}
            onChange={handlePriceChange}
            placeholder="Min ₹"
            min="0"
            className="w-full text-xs rounded-xl border border-earth-300 dark:border-earth-700 bg-earth-50 dark:bg-earth-800 py-2 px-3 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice || ''}
            onChange={handlePriceChange}
            placeholder="Max ₹"
            min="0"
            className="w-full text-xs rounded-xl border border-earth-300 dark:border-earth-700 bg-earth-50 dark:bg-earth-800 py-2 px-3 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-earth-700 dark:text-earth-300">
          Farm Location / State
        </label>
        <input
          type="text"
          value={filters.location || ''}
          onChange={handleLocationChange}
          placeholder="e.g. Maharashtra, Punjab..."
          className="w-full text-xs rounded-xl border border-earth-300 dark:border-earth-700 bg-earth-50 dark:bg-earth-800 py-2 px-3 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
        />
      </div>

      {isMobile && (
        <div className="pt-4 border-t border-earth-200 dark:border-earth-800">
          <Button onClick={onCloseMobile} variant="primary" size="md" className="w-full">
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
