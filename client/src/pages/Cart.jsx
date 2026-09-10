import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Sprout } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount, itemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your Farm Basket is Empty"
          description="You have not added any fresh agricultural produce yet. Explore the marketplace to connect with local farmers."
          actionLabel="Explore Marketplace"
          onAction={() => navigate('/marketplace')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-earth-200 dark:border-earth-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white tracking-tight">
            Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs sm:text-sm text-earth-500">
            Fresh harvest reserved directly from the grower
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Basket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ product, quantity }) => {
            const img = product.images && product.images.length > 0
              ? product.images[0]
              : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';

            const subtotal = Math.round((product.price || 0) * quantity * 100) / 100;
            const maxAllowed = product.availableQuantity || 999;

            return (
              <Card key={product._id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={img}
                    alt={product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-earth-200 dark:border-earth-800 shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <Link
                      to={`/products/${product._id}`}
                      className="font-bold text-sm sm:text-base text-earth-900 dark:text-white hover:text-forest-600 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-earth-500 flex items-center gap-1">
                      <span>🌾 {product.farmer?.farmName || product.farmer?.name || 'Local Farmer'}</span>
                      <span>•</span>
                      <span>{product.location}</span>
                    </p>
                    <p className="text-xs font-semibold text-forest-700 dark:text-forest-400">
                      {formatCurrency(product.price)} / {product.unit}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-earth-100 dark:border-earth-800">
                  <div className="flex items-center rounded-xl border border-earth-300 dark:border-earth-700 bg-earth-50 dark:bg-earth-800 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                      className="px-3 py-1.5 text-earth-600 dark:text-earth-300 hover:bg-earth-200 dark:hover:bg-earth-700"
                    >
                      -
                    </button>
                    <span className="w-9 text-center text-xs font-bold text-earth-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                      disabled={quantity >= maxAllowed}
                      className="px-3 py-1.5 text-earth-600 dark:text-earth-300 hover:bg-earth-200 dark:hover:bg-earth-700 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <span className="text-sm sm:text-base font-extrabold text-earth-900 dark:text-white">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(product._id)}
                    className="p-2 text-earth-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}

          <div className="pt-4">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-600 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <Card className="p-6 space-y-6 sticky top-24">
            <h3 className="text-base font-bold text-earth-900 dark:text-white pb-3 border-b border-earth-100 dark:border-earth-800">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-earth-600 dark:text-earth-400">
                <span>Produce Subtotal</span>
                <span className="font-semibold text-earth-900 dark:text-white">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-earth-600 dark:text-earth-400">
                <span>Direct Farmer Transport</span>
                <span className="text-emerald-600 font-semibold">Free (COD Promotion)</span>
              </div>
              <div className="flex justify-between text-earth-600 dark:text-earth-400">
                <span>Middleman Fees</span>
                <span className="text-forest-600 font-semibold">₹0 (Zero Markup)</span>
              </div>
              <div className="pt-3 border-t border-earth-100 dark:border-earth-800 flex justify-between items-baseline">
                <span className="text-base font-bold text-earth-900 dark:text-white">
                  Total Payable (COD)
                </span>
                <span className="text-xl font-extrabold text-forest-700 dark:text-forest-400">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            <Button
              onClick={() => navigate('/checkout')}
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full"
            >
              Proceed to Checkout
            </Button>

            <p className="text-[11px] text-earth-400 text-center leading-relaxed">
              Safe & secure checkout. Pay cash or UPI directly when your farmer produce arrives at your doorstep.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
