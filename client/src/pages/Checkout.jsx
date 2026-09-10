import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, MapPin, Phone, User } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import { formatCurrency } from '../utils/formatters';
import { showToast } from '../components/common/Toast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState({});

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Location services are not available in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setLocation({ latitude: coords.latitude, longitude: coords.longitude, provider: 'browser-gps' }),
      () => setError('Allow location access or enter your address manually.')
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setError('Please provide the recipient full name.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please provide a contact phone number.');
      return;
    }
    if (!formData.address.trim()) {
      setError('Street delivery address is required.');
      return;
    }
    if (!formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
      setError('City, State, and Pincode are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const orderPayload = {
        items: items.map((i) => ({
          product: i.product._id,
          quantity: i.quantity
        })),
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          location
        },
        paymentMethod
      };

      const res = await orderService.createOrder(orderPayload);
      const createdOrder = res.data.order;

      clearCart();
      showToast('Your order has been placed successfully with direct farmer confirmation!', 'success');
      navigate(`/orders/${createdOrder._id}`);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth-500 hover:text-forest-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shopping Cart</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white tracking-tight mt-2">
          Checkout & Shipping
        </h1>
        <p className="text-xs sm:text-sm text-earth-500">
          Direct farm-to-door delivery details
        </p>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Customer Info Card */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-earth-900 dark:text-white flex items-center gap-2 pb-3 border-b border-earth-100 dark:border-earth-800">
                <User className="w-4 h-4 text-forest-600" />
                <span>Recipient Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </Card>

            {/* Shipping Address Card */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-earth-900 dark:text-white flex items-center gap-2 pb-3 border-b border-earth-100 dark:border-earth-800">
                <MapPin className="w-4 h-4 text-forest-600" />
                <span>Delivery Address</span>
              </h3>

              <Input
                label="Street Address / House / Flat"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. Flat 402, Lotus Greens, Near City Center"
                required
              />
              <button type="button" onClick={useCurrentLocation} className="text-xs font-semibold text-forest-700 dark:text-forest-400 hover:underline">
                {location.latitude ? 'Delivery pin captured from current location' : 'Use current location for delivery pin'}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  required
                />
                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Maharashtra"
                  required
                />
                <Input
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 400053"
                  required
                />
              </div>
            </Card>

            {/* Payment Method Card */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-earth-900 dark:text-white flex items-center gap-2 pb-3 border-b border-earth-100 dark:border-earth-800">
                <ShieldCheck className="w-4 h-4 text-forest-600" />
                <span>Payment Method</span>
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 rounded-2xl border-2 border-forest-600 bg-forest-50/50 dark:bg-forest-950/40 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-forest-600 focus:ring-forest-500 w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-bold text-earth-900 dark:text-white">
                        Cash on Delivery (COD) / Direct UPI
                      </p>
                      <p className="text-xs text-earth-500">
                        Pay cash or scan UPI directly upon physical harvest receipt
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-forest-700 dark:text-forest-300">
                    Recommended
                  </span>
                </label>
              </div>

              <p className="text-[11px] text-earth-400">
                Structure is pre-architected for instant Razorpay / Stripe gateway integration.
              </p>
            </Card>
          </div>

          {/* Right Column: Order Summary Review */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="p-6 space-y-6 sticky top-24">
              <h3 className="text-base font-bold text-earth-900 dark:text-white pb-3 border-b border-earth-100 dark:border-earth-800">
                Order Review
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div key={product._id} className="flex justify-between items-center text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-earth-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-earth-400">
                        {quantity} {product.unit} × {formatCurrency(product.price)}
                      </p>
                    </div>
                    <span className="font-bold text-earth-900 dark:text-white shrink-0">
                      {formatCurrency(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-earth-100 dark:border-earth-800 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-earth-600 dark:text-earth-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-earth-600 dark:text-earth-400">
                  <span>Direct Delivery</span>
                  <span className="text-emerald-600 font-semibold">Free</span>
                </div>
                <div className="pt-2 border-t border-earth-100 dark:border-earth-800 flex justify-between items-baseline">
                  <span className="text-base font-bold text-earth-900 dark:text-white">
                    Total Amount
                  </span>
                  <span className="text-2xl font-black text-forest-700 dark:text-forest-400">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 font-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full shadow-lg hover:shadow-glow-green"
              >
                Place Farm Order
              </Button>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
