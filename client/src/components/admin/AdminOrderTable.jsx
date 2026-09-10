import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../common/Badge';

const statusVariants = {
  pending: 'harvest',
  confirmed: 'blue',
  processing: 'purple',
  shipped: 'forest',
  delivered: 'green',
  cancelled: 'red'
};

const AdminOrderTable = ({ orders = [], agents = [], onAssign }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-earth-200/80 dark:border-earth-800/80 bg-white dark:bg-earth-900 shadow-subtle">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-earth-200 dark:border-earth-800 bg-earth-50/70 dark:bg-earth-950/40 text-earth-600 dark:text-earth-400 font-bold uppercase tracking-wider text-[11px]">
            <th className="py-3.5 px-4">Order ID</th>
            <th className="py-3.5 px-4">Buyer</th>
            <th className="py-3.5 px-4">Items</th>
            <th className="py-3.5 px-4">Total Amount</th>
            <th className="py-3.5 px-4">Date</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Delivery Agent</th>
            <th className="py-3.5 px-4 text-right">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-earth-100 dark:divide-earth-800/80">
          {orders.map((order) => {
            const shortId = order._id.slice(-6).toUpperCase();
            return (
              <tr key={order._id} className="hover:bg-earth-50/50 dark:hover:bg-earth-800/40 transition-colors">
                <td className="py-3 px-4 font-bold text-earth-900 dark:text-white">
                  #{shortId}
                </td>
                <td className="py-3 px-4">
                  <select
                    value={order.deliveryAgent?._id || ''}
                    onChange={(event) => event.target.value && onAssign(order._id, event.target.value)}
                    className="max-w-36 rounded-lg border border-earth-200 bg-white px-2 py-1 text-[11px] dark:border-earth-700 dark:bg-earth-900"
                    aria-label={`Assign delivery agent for order ${shortId}`}
                  >
                    <option value="">Assign agent</option>
                    {agents.map((agent) => <option key={agent._id} value={agent._id}>{agent.name}</option>)}
                  </select>
                </td>
                <td className="py-3 px-4">
                  <p className="font-semibold text-earth-900 dark:text-white">
                    {order.buyer?.name || 'Buyer'}
                  </p>
                  <p className="text-[11px] text-earth-400">
                    {order.shippingAddress?.city || 'India'}
                  </p>
                </td>
                <td className="py-3 px-4 text-earth-700 dark:text-earth-300">
                  {order.items?.length || 0} produce line(s)
                </td>
                <td className="py-3 px-4 font-bold text-forest-700 dark:text-forest-400">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="py-3 px-4 text-earth-500 text-xs">
                  {formatDate(order.createdAt)}
                </td>
                <td className="py-3 px-4">
                  <Badge variant={statusVariants[order.orderStatus] || 'earth'} size="sm" className="capitalize">
                    {order.orderStatus}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-xs font-semibold text-forest-600 hover:text-forest-700 dark:text-forest-400"
                  >
                    View Details →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderTable;
