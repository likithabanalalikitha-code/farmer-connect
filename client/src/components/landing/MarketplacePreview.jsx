import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../marketplace/ProductCard';
import Button from '../common/Button';

// Sample preview items matching our seed data
const previewProducts = [
  {
    _id: 'prev-1',
    name: 'Farm Fresh Organic Red Tomatoes',
    category: 'Vegetables',
    price: 38,
    unit: 'kg',
    availableQuantity: 420,
    organic: true,
    location: 'Nashik, Maharashtra',
    farmer: { name: 'Ramesh Patel', farmName: 'Green Fields Organic Farm' },
    images: ['https://images.unsplash.com/photo-1546470427-e26264be0b11?w=800&auto=format&fit=crop&q=80']
  },
  {
    _id: 'prev-2',
    name: 'Premium Aged Basmati Rice (1121 XXL Grain)',
    category: 'Grains',
    price: 145,
    unit: 'kg',
    availableQuantity: 1850,
    organic: false,
    location: 'Ludhiana, Punjab',
    farmer: { name: 'Gurpreet Singh', farmName: 'Punjab Golden Harvest' },
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80']
  },
  {
    _id: 'prev-3',
    name: 'Original Ratnagiri Alphonso Mangoes (Hapus)',
    category: 'Fruits',
    price: 750,
    unit: 'dozen',
    availableQuantity: 110,
    organic: true,
    location: 'Guntur, Andhra Pradesh',
    farmer: { name: 'Sunita Rao', farmName: 'Deccan Agro Orchards' },
    images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80']
  },
  {
    _id: 'prev-4',
    name: 'Pure Desi A2 Cow Ghee (Bilona Method)',
    category: 'Dairy',
    price: 850,
    unit: 'liter',
    availableQuantity: 65,
    organic: true,
    location: 'Nashik, Maharashtra',
    farmer: { name: 'Ramesh Patel', farmName: 'Green Fields Organic Farm' },
    images: ['https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&auto=format&fit=crop&q=80']
  }
];

const MarketplacePreview = () => {
  return (
    <section className="py-20 bg-earth-50 dark:bg-earth-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-600 dark:text-forest-400 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Direct Listings
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-earth-900 dark:text-white tracking-tight">
              Featured Harvests
            </h2>
            <p className="text-sm text-earth-600 dark:text-earth-400 mt-1">
              Freshly harvested produce listed directly by verified regional farmers.
            </p>
          </div>

          <Link to="/marketplace">
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              View All Produce
            </Button>
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketplacePreview;
