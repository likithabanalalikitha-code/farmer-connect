import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import { productService } from '../services/productService';
import { showToast } from '../components/common/Toast';
import Sidebar from '../components/layout/Sidebar';
import FarmerProductTable from '../components/farmer/FarmerProductTable';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

const FarmerProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchFarmerProducts = async () => {
    try {
      setIsLoading(true);
      const res = await productService.getFarmerProducts();
      setProducts(res.data.products || []);
    } catch (err) {
      showToast(err.message || 'Could not fetch your crops.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerProducts();
  }, []);

  const handleToggleStatus = async (id, newActiveState) => {
    try {
      await productService.updateProduct(id, { isActive: newActiveState });
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: newActiveState } : p))
      );
      showToast(newActiveState ? 'Produce is now active on market!' : 'Produce unlisted.', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to update crop status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast('Crop listing removed successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to remove product.', 'error');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Sidebar role="farmer" />

        <main className="flex-1 w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white tracking-tight">
                My Produce Inventory
              </h1>
              <p className="text-xs sm:text-sm text-earth-500">
                Manage your live harvests, edit pricing in ₹, and update crop quantities
              </p>
            </div>

            <Link to="/farmer/products/add">
              <Button variant="primary" size="md" icon={PlusCircle}>
                Add New Crop
              </Button>
            </Link>
          </div>

          {/* Search bar */}
          <div className="max-w-sm">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-earth-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter listed produce..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-earth-300 dark:border-earth-700 bg-white dark:bg-earth-900 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>

          {/* Table or Empty */}
          {isLoading ? (
            <div className="py-20 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="You haven't listed any crops yet"
              description="Start selling your harvest directly to consumers. It only takes a minute to list your first produce!"
              actionLabel="List First Crop"
              onAction={() => (window.location.href = '/farmer/products/add')}
            />
          ) : (
            <FarmerProductTable
              products={filteredProducts}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default FarmerProducts;
