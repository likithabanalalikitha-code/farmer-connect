import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Filter } from 'lucide-react';
import { orderService } from '../services/orderService';
import OrderCard from '../components/consumer/OrderCard';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import Pagination from '../components/common/Pagination';
import Spinner from '../components/common/Spinner';

const statuses = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' }
];

const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentStatus = searchParams.get('status') || 'all';
  const currentPage = parseInt(searchParams.get('page'), 10) || 1;

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = { page: currentPage, limit: 10 };
      if (currentStatus !== 'all') params.status = currentStatus;

      const res = await orderService.getOrders(params);
      setOrders(res.data || []);
      if (res.meta) setPagination(res.meta);
    } catch (err) {
      setError(err.message || 'Could not fetch your orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentStatus, currentPage]);

  const handleStatusTab = (statusKey) => {
    setSearchParams({ status: statusKey, page: '1' });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ status: currentStatus, page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white tracking-tight">
          My Farm Orders
        </h1>
        <p className="text-xs sm:text-sm text-earth-500">
          Track harvest deliveries and past purchase history
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-earth-200 dark:border-earth-800 no-scrollbar">
        {statuses.map((s) => (
          <button
            key={s.key}
            onClick={() => handleStatusTab(s.key)}
            className={`text-xs px-3.5 py-2 rounded-xl font-semibold shrink-0 transition-colors ${
              currentStatus === s.key
                ? 'bg-forest-600 text-white shadow-sm'
                : 'bg-white dark:bg-earth-900 border border-earth-200 dark:border-earth-800 text-earth-600 dark:text-earth-400 hover:bg-earth-100 dark:hover:bg-earth-800'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-20 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchOrders} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No Orders Found"
          description={
            currentStatus === 'all'
              ? "You haven't placed any farm orders yet. Visit the marketplace to order direct from growers!"
              : `You don't have any orders currently in "${currentStatus}" status.`
          }
          actionLabel="Explore Marketplace"
          onAction={() => navigate('/marketplace')}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}

          {pagination.pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
