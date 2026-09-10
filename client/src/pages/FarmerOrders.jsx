import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, MapPin, CheckCircle, Clock } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { showToast } from '../components/common/Toast';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

const validNextStatuses = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: []
};

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await orderService.getOrders();
      setOrders(res.data || []);
    } catch (err) {
      showToast(err.message || 'Failed to load incoming orders.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await orderService.updateOrderStatus(orderId, newStatus, `Updated by farmer`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data.order : o))
      );
      showToast(`Order status transitioned to ${newStatus.toUpperCase()}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update order status.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Sidebar role="farmer" />

        <main className="flex-1 w-full space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white tracking-tight">
              Customer Farm Orders
            </h1>
            <p className="text-xs sm:text-sm text-earth-500">
              Manage incoming requests, prepare packing, and update dispatch status
            </p>
          </div>

          {isLoading ? (
            <div className="py-20 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No Orders Received Yet"
              description="When consumers order your produce, they will appear here with shipping addresses and contact details."
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const shortId = order._id.slice(-6).toUpperCase();
                const allowedTransitions = validNextStatuses[order.orderStatus] || [];

                return (
                  <Card key={order._id} className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between pb-3 border-b border-earth-100 dark:border-earth-800 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-earth-900 dark:text-white">
                            Order #{shortId}
                          </h3>
                          <Badge variant="earth" size="sm" className="capitalize">
                            {order.orderStatus}
                          </Badge>
                        </div>
                        <p className="text-xs text-earth-500 mt-0.5">
                          Received on {formatDate(order.createdAt)}
                        </p>
                      </div>

                      {/* Status Transition Control */}
                      {allowedTransitions.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-earth-600 dark:text-earth-400">
                            Update:
                          </span>
                          <select
                            onChange={(e) => {
                              if (e.target.value) handleUpdateStatus(order._id, e.target.value);
                            }}
                            defaultValue=""
                            className="text-xs font-semibold rounded-xl border border-forest-300 dark:border-forest-700 bg-white dark:bg-earth-800 py-1.5 px-3 text-forest-700 dark:text-forest-300 focus:outline-none focus:ring-2 focus:ring-forest-500"
                          >
                            <option value="" disabled>
                              Select Next Step...
                            </option>
                            {allowedTransitions.map((st) => (
                              <option key={st} value={st}>
                                Mark as {st.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className="text-xs text-earth-400 italic">
                          Status completed
                        </span>
                      )}
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-earth-50/50 dark:bg-earth-800/40 p-3 rounded-2xl">
                      <div>
                        <p className="font-bold text-earth-900 dark:text-white mb-0.5">
                          Customer: {order.buyer?.name || order.shippingAddress?.fullName}
                        </p>
                        <p className="text-earth-500">Phone: {order.shippingAddress?.phone}</p>
                      </div>
                      <div className="flex items-start gap-1.5 text-earth-600 dark:text-earth-400">
                        <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0 mt-0.5" />
                        <span>
                          {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                        </span>
                      </div>
                    </div>

                    {/* Ordered Items Table */}
                    <div className="divide-y divide-earth-100 dark:divide-earth-800 text-xs sm:text-sm">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-earth-900 dark:text-white">
                              {item.name}
                            </span>
                            <span className="text-earth-500 ml-2">
                              × {item.quantity} {item.unit}
                            </span>
                          </div>
                          <span className="font-bold text-earth-900 dark:text-white">
                            {formatCurrency(item.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="pt-3 border-t border-earth-100 dark:border-earth-800 flex justify-between items-center text-xs">
                      <span className="text-earth-500">
                        Payment Mode: <strong>{order.paymentMethod}</strong>
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-forest-700 dark:text-forest-400">
                        Total: {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FarmerOrders;
