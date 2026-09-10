import React, { useEffect, useState } from 'react';
import { CheckCircle, MapPin, Package, Play } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Spinner from '../components/common/Spinner';
import Badge from '../components/common/Badge';
import { orderService } from '../services/orderService';
import { showToast } from '../components/common/Toast';
import DeliveryMap from '../components/delivery/DeliveryMap';

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState({});

  const loadOrders = async () => {
    try {
      const response = await orderService.getOrders({ limit: 50 });
      setOrders(response.data || []);
    } catch (error) {
      showToast(error.message || 'Unable to load delivery assignments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const startDelivery = async (id) => {
    try {
      await orderService.startDelivery(id);
      showToast('Delivery started. Ask the customer for the OTP at handover.', 'success');
      loadOrders();
    } catch (error) { showToast(error.message || 'Unable to start delivery.', 'error'); }
  };

  const acceptOrder = async (id) => {
    try {
      await orderService.acceptDeliveryOrder(id);
      showToast('Order accepted. You can now start the delivery.', 'success');
      loadOrders();
    } catch (error) { showToast(error.message || 'Unable to accept this order.', 'error'); }
  };

  const completeDelivery = async (id) => {
    try {
      await orderService.verifyDeliveryOtp(id, otp[id]);
      showToast('Order marked as delivered.', 'success');
      loadOrders();
    } catch (error) { showToast(error.message || 'OTP verification failed.', 'error'); }
  };

  if (loading) return <div className="min-h-[70vh] flex items-center justify-center"><Spinner size="lg" /></div>;

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <Sidebar role="delivery-agent" />
      <main className="flex-1 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white">Delivery Queue</h1>
          <p className="text-sm text-earth-500">Accept assigned orders, follow the customer address, and verify handover with OTP.</p>
        </div>
        {orders.length === 0 ? <Card className="p-8 text-center text-sm text-earth-500">No delivery assignments are waiting for you.</Card> : orders.map((order) => (
          <Card key={order._id} className="p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="font-bold text-earth-900 dark:text-white">Order #{order._id.slice(-6).toUpperCase()}</p><p className="text-sm text-earth-500">{order.buyer?.name || 'Customer'}</p></div>
              <Badge variant="earth" size="sm" className="capitalize">{order.orderStatus.replaceAll('_', ' ')}</Badge>
            </div>
            <div className="flex gap-2 text-sm text-earth-600 dark:text-earth-300"><MapPin className="w-4 h-4 shrink-0 text-forest-600" />{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.pincode}</div>
            <div className="flex gap-2 text-sm text-earth-600 dark:text-earth-300"><Package className="w-4 h-4 shrink-0 text-forest-600" />{order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}</div>
            {!order.deliveryAgent && ['confirmed', 'processing'].includes(order.orderStatus) && <Button icon={CheckCircle} onClick={() => acceptOrder(order._id)}>Accept Order</Button>}
            {order.deliveryAgent && order.deliveryAgent._id && order.orderStatus === 'ready_for_pickup' && <Button icon={Play} onClick={() => startDelivery(order._id)}>Start Delivery</Button>}
            {order.orderStatus === 'out_for_delivery' && <div className="flex flex-col sm:flex-row gap-3"><Input label="Customer OTP" value={otp[order._id] || ''} onChange={(event) => setOtp({ ...otp, [order._id]: event.target.value })} placeholder="6 digit OTP" /><Button icon={CheckCircle} onClick={() => completeDelivery(order._id)}>Confirm Delivery</Button></div>}
            {order.orderStatus === 'out_for_delivery' && <DeliveryMap order={order} />}
          </Card>
        ))}
      </main>
    </div>
  </div>;
};

export default DeliveryOrders;