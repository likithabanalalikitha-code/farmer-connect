import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { adminService } from '../services/userService';
import { showToast } from '../components/common/Toast';
import Sidebar from '../components/layout/Sidebar';
import AdminProductTable from '../components/admin/AdminProductTable';
import Pagination from '../components/common/Pagination';
import Spinner from '../components/common/Spinner';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async (page = 1) => {
    try {
      setIsLoading(true);
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();

      const res = await adminService.getProducts(params);
      setProducts(res.data || []);
      if (res.meta) setPagination(res.meta);
    } catch (err) {
      showToast(err.message || 'Failed to load products.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(1);
  };

  const handleToggleStatus = async (id, newActiveState) => {
    try {
      await adminService.updateProductStatus(id, newActiveState);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: newActiveState } : p))
      );
      showToast(newActiveState ? 'Listing approved and live' : 'Listing unlisted', 'info');
    } catch (err) {
      showToast(err.message || 'Could not update listing status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    try {
      await adminService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast('Product permanently deleted by admin.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete product.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Sidebar role="admin" />

        <main className="flex-1 w-full space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white tracking-tight">
              Product Moderation
            </h1>
            <p className="text-xs sm:text-sm text-earth-500">
              Audit agricultural listings, monitor compliance, and moderate produce offerings
            </p>
          </div>

          <div className="max-w-sm">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 w-4 h-4 text-earth-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search crop title or farmer name..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-earth-300 dark:border-earth-700 bg-white dark:bg-earth-900 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </form>
          </div>

          {isLoading ? (
            <div className="py-20 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="space-y-4">
              <AdminProductTable
                products={products}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
              {pagination.pages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={(p) => fetchProducts(p)}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminProducts;
