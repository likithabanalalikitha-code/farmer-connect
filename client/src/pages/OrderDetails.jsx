import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency, formatDate } from '../utils/formatters';
import { showToast } from '../components/common/Toast';
import OrderTimeline from '../components/consumer/OrderTimeline';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import ErrorState from '../components/common/ErrorState';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [addressEditing, setAddressEditing] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressForm, setAddressForm] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await orderService.getOrderById(id);
      setOrder(res.data.order);
    } catch (err) {
      setError(err.message || 'Could not load order details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  useEffect(() => {
    if (order?.orderStatus !== 'out_for_delivery' || order.deliveryOtp) return undefined;

    const refreshDeliveryCode = async () => {
      try {
        const res = await orderService.getOrderById(id);
        setOrder(res.data.order);
      } catch {
        // Keep the current order view stable during background refreshes.
      }
    };

    const intervalId = window.setInterval(refreshDeliveryCode, 5000);
    return () => window.clearInterval(intervalId);
  }, [id, order?.orderStatus, order?.deliveryOtp]);

  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);
      const res = await orderService.cancelOrder(id, cancelReason);
      setOrder(res.data.order);
      setCancelModalOpen(false);
      showToast('Order was successfully cancelled. Products restocked.', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to cancel order.', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const startAddressEdit = () => {
    setAddressForm({
      ...order.shippingAddress,
      location: order.shippingAddress?.location || {}
    });
    setAddressEditing(true);
  };

  const saveAddress = async (event) => {
    event.preventDefault();
    try {
      setAddressSaving(true);
      const response = await orderService.updateDeliveryAddress(id, addressForm);
      setOrder(response.data.order);
      setAddressEditing(false);
      showToast('Address updated. The delivery agent has been notified.', 'success');
    } catch (err) {
      showToast(err.message || 'Unable to update delivery address.', 'error');
    } finally {
      setAddressSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState
          title="Order Not Found"
          message={error || 'Unable to retrieve this order.'}
          onRetry={() => navigate('/orders')}
        />
      </div>
    );
  }

  const shortId = order._id.slice(-6).toUpperCase();
  const isBuyer = order.buyer?._id === user?._id;
  const isEligibleForCancellation = ['pending', 'confirmed'].includes(order.orderStatus);
  const isEligibleForAddressEdit = isBuyer && order.deliveryAddressEditCount < 1 && ['pending', 'confirmed', 'processing', 'ready_for_pickup'].includes(order.orderStatus);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth-500 hover:text-forest-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Orders</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white tracking-tight mt-1">
            Order #{shortId}
          </h1>
          <p className="text-xs text-earth-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEligibleForCancellation && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(true)}
              className="text-red-600 border-red-300 hover:bg-red-50 dark:border-red-900/60 dark:hover:bg-red-950/30"
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Visual Tracking Progress Timeline */}
      <Card className="p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-earth-500 mb-2">
          Shipment Progress
        </h3>
        <OrderTimeline currentStatus={order.orderStatus} timeline={order.timeline || []} />
      </Card>

      {isBuyer && order.orderStatus === 'out_for_delivery' && (
        <Card className="border-2 border-forest-500 bg-forest-50/70 p-6 dark:bg-forest-950/30">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-earth-900 dark:text-white">Share this delivery OTP</h3>
              <p className="text-xs text-earth-600 dark:text-earth-300">Give this code to the delivery agent only when your order arrives.</p>
            </div>
            {order.deliveryOtp ? (
              <span className="rounded-xl bg-white px-5 py-3 text-2xl font-black tracking-[0.3em] text-forest-700 shadow-sm dark:bg-earth-900 dark:text-forest-300">
                {order.deliveryOtp}
              </span>
            ) : (
              <span className="text-xs font-semibold text-earth-600 dark:text-earth-300">Your secure handover code will appear here when the delivery agent is ready.</span>
            )}
          </div>
        </Card>
      )}

      {/* 2-Column Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ordered Items */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-earth-900 dark:text-white pb-3 border-b border-earth-100 dark:border-earth-800">
              Harvest Produce ({order.items?.length || 0} items)
            </h3>

            <div className="divide-y divide-earth-100 dark:divide-earth-800">
              {order.items?.map((item, idx) => {
                const img = item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';
                return (
                  <div key={idx} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={img}
                        alt={item.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-earth-200 dark:border-earth-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/products/${item.product?._id || item.product}`}
                          className="font-bold text-sm text-earth-900 dark:text-white hover:text-forest-600 transition-colors truncate block"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-earth-500">
                          From 🌾 {item.farmer?.farmName || item.farmer?.name || 'Local Farm'}
                        </p>
                        <p className="text-xs text-earth-500">
                          {formatCurrency(item.price)} × {item.quantity} {item.unit}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-sm sm:text-base text-earth-900 dark:text-white">
                        {formatCurrency(item.subtotal)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Calculation */}
            <div className="pt-4 border-t border-earth-100 dark:border-earth-800 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-earth-600 dark:text-earth-400">
                <span>Subtotal</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-earth-600 dark:text-earth-400">
                <span>Transport & Packing</span>
                <span className="text-emerald-600 font-semibold">Free</span>
              </div>
              <div className="pt-2 border-t border-earth-100 dark:border-earth-800 flex justify-between items-baseline font-extrabold text-base sm:text-lg text-earth-950 dark:text-white">
                <span>Total Amount (COD)</span>
                <span className="text-forest-700 dark:text-forest-400">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Address & Payment Info */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-earth-900 dark:text-white flex items-center gap-2 pb-3 border-b border-earth-100 dark:border-earth-800">
              <MapPin className="w-4 h-4 text-forest-600" />
              <span>Delivery Address</span>
            </h3>

            <div className="space-y-1 text-xs sm:text-sm text-earth-700 dark:text-earth-300">
              <p className="font-bold text-earth-900 dark:text-white">
                {order.shippingAddress?.fullName}
              </p>
              <p className="text-earth-500">
                Phone: {order.shippingAddress?.phone}
              </p>
              <p>{order.shippingAddress?.address}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
            </div>
            {isEligibleForAddressEdit && (
              <Button variant="outline" size="sm" onClick={startAddressEdit}>Edit address once</Button>
            )}
            {order.deliveryAddressEditCount >= 1 && <p className="text-[11px] text-earth-400">Address already updated once for this order.</p>}
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="text-base font-bold text-earth-900 dark:text-white flex items-center gap-2 pb-3 border-b border-earth-100 dark:border-earth-800">
              <ShieldCheck className="w-4 h-4 text-forest-600" />
              <span>Payment Details</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-earth-500">Method:</span>
                <span className="font-semibold text-earth-900 dark:text-white">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-earth-500">Status:</span>
                <Badge
                  variant={order.paymentStatus === 'paid' ? 'green' : 'harvest'}
                  size="sm"
                  className="capitalize"
                >
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={addressEditing} onClose={() => setAddressEditing(false)} title="Update Delivery Address" maxWidth="max-w-lg">
        {addressForm && <form onSubmit={saveAddress} className="space-y-4">
          {['fullName', 'phone', 'address', 'city', 'state', 'pincode'].map((field) => (
            <Input key={field} label={field === 'fullName' ? 'Recipient name' : field.charAt(0).toUpperCase() + field.slice(1)} name={field} value={addressForm[field] || ''} onChange={(event) => setAddressForm({ ...addressForm, [field]: event.target.value })} required />
          ))}
          <div className="flex justify-end gap-3"><Button variant="ghost" onClick={() => setAddressEditing(false)}>Cancel</Button><Button type="submit" isLoading={addressSaving} icon={MapPin}>Save New Address</Button></div>
        </form>}
      </Modal>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel This Order"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-earth-900 dark:text-white">
                Are you sure you want to cancel?
              </h4>
              <p className="text-xs text-earth-500 mt-1">
                Your order will be stopped and reserved produce will be returned to the farmer's inventory.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 dark:text-earth-300 mb-1.5">
              Reason for Cancellation (Optional)
            </label>
            <textarea
              rows={2}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Ordered by mistake, change in requirement..."
              className="w-full text-xs rounded-xl border border-earth-300 dark:border-earth-700 bg-white dark:bg-earth-900 p-2.5 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCancelModalOpen(false)}
            >
              Keep Order
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isCancelling}
              onClick={handleCancelOrder}
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetails;
