import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, MapPin, Truck } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../common/Card';
import Badge from '../common/Badge';

const statusVariants = {
  pending: 'harvest',
  confirmed: 'blue',
  processing: 'purple',
  shipped: 'forest',
  delivered: 'green',
  cancelled: 'red'
};

const OrderCard = ({ order }) => {
  const shortId = order._id.slice(-6).toUpperCase();

  return (
    <Card className="p-6 overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-earth-100 dark:border-earth-800 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-forest-50 dark:bg-forest-950 text-forest-600 flex items-center justify-center font-bold text-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-earth-900 dark:text-white">
              Order #{shortId}
            </h4>
            <p className="text-xs text-earth-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={statusVariants[order.orderStatus] || 'earth'} size="sm" className="capitalize">
            {order.orderStatus}
          </Badge>
        </div>
      </div>

      {/* Items Preview */}
      <div className="py-4 space-y-2">
        {order.items.slice(0, 3).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-earth-800 dark:text-earth-200 truncate max-w-[220px]">
                {item.name}
              </span>
              <span className="text-earth-400">
                × {item.quantity} {item.unit}
              </span>
            </div>
            <span className="font-semibold text-earth-900 dark:text-white">
              {formatCurrency(item.subtotal)}
            </span>
          </div>
        ))}

        {order.items.length > 3 && (
          <p className="text-xs text-earth-500 italic">
            + {order.items.length - 3} more item(s)
          </p>
        )}
      </div>

      {/* Footer Summary */}
      <div className="pt-4 border-t border-earth-100 dark:border-earth-800 flex items-center justify-between">
        <div>
          <span className="text-xs text-earth-500">Total Bill (COD)</span>
          <p className="text-base sm:text-lg font-extrabold text-forest-700 dark:text-forest-400">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>

        <Link
          to={`/orders/${order._id}`}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-forest-600 hover:text-forest-700 dark:text-forest-400"
        >
          <span>Track Order</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </Card>
  );
};

export default OrderCard;
