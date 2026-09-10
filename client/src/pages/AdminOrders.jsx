import React, { useState, useEffect } from 'react';
import { adminService } from '../services/userService';
import { showToast } from '../components/common/Toast';
import Sidebar from '../components/layout/Sidebar';
import AdminOrderTable from '../components/admin/AdminOrderTable';
import Pagination from '../components/common/Pagination';
import Spinner from '../components/common/Spinner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async (page = 1) => {
    try {
      setIsLoading(true);
      const params = { page, limit: 10 };
      if (statusFilter !== 'all') params.status = statusFilter;

      const [res, agentRes] = await Promise.all([
        adminService.getOrders(params),
        adminService.getUsers({ role: 'delivery-agent', limit: 50 })
      ]);
      setOrders(res.data || []);
      setAgents(agentRes.data || []);
      if (res.meta) setPagination(res.meta);
    } catch (err) {
      showToast(err.message || 'Failed to load platform orders.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async (orderId, agentId) => {
    try {
      await adminService.assignDeliveryAgent(orderId, agentId);
      showToast('Delivery agent assigned.', 'success');
      fetchOrders(pagination.page);
    } catch (err) {
      showToast(err.message || 'Unable to assign delivery agent.', 'error');
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [statusFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Sidebar role="admin" />

        <main className="flex-1 w-full space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white tracking-tight">
              Platform Orders
            </h1>
            <p className="text-xs sm:text-sm text-earth-500">
              Audit all consumer purchases, logistics progression, and delivery records
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['all', 'pending', 'confirmed', 'processing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold capitalize shrink-0 transition-colors ${
                  statusFilter === st
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white dark:bg-earth-900 border border-earth-200 dark:border-earth-800 text-earth-600 dark:text-earth-400'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="py-20 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="space-y-4">
              <AdminOrderTable orders={orders} agents={agents} onAssign={handleAssign} />
              {pagination.pages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={(p) => fetchOrders(p)}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminOrders;
