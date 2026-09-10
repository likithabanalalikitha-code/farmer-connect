import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  PlusCircle,
  Clock,
  ArrowRight,
  Sprout
} from 'lucide-react';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { formatCurrency, formatDate } from '../utils/formatters';
import Sidebar from '../components/layout/Sidebar';
import DashboardCard from '../components/farmer/DashboardCard';
import SalesChart from '../components/farmer/SalesChart';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const FarmerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const [prodRes, orderRes] = await Promise.all([
          productService.getFarmerProducts(),
          orderService.getOrders({ limit: 5 }),
          orderService.getFarmerStats()
        ]);
        setProducts(prodRes.data.products || []);
        setOrders(orderRes.data || []);
        setStats(statsRes.data);
        setSalesData(statsRes.data.monthlySales || []);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Calculate metrics
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const pendingOrders = stats?.pendingOrders || 0;
  const totalSales = stats?.totalRevenue || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Nav */}
        <Sidebar role="farmer" />

        {/* Dashboard Content */}
        <main className="flex-1 w-full space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white tracking-tight">
                Farmer Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-earth-500">
                Monitor your harvest listings, orders, and direct sales metrics
              </p>
            </div>

            <Link to="/farmer/products/add">
              <Button variant="primary" size="md" icon={PlusCircle}>
                List New Harvest
              </Button>
            </Link>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard
              title="Total Revenue"
              value={formatCurrency(totalSales)}
              subtitle="Direct crop receipts"
              icon={TrendingUp}
              variant="forest"
            />
            <DashboardCard
              title="Active Produce"
              value={`${activeProducts} / ${totalProducts}`}
              subtitle="Live on marketplace"
              icon={Package}
              variant="harvest"
            />
            <DashboardCard
              title="Pending Orders"
              value={pendingOrders}
              subtitle="Needs harvest / packing"
              icon={Clock}
              variant="blue"
            />
            <DashboardCard
              title="Total Orders"
              value={stats?.totalOrders || 0}
              subtitle="Direct consumer orders"
              icon={ShoppingBag}
              variant="purple"
            />
          </div>

          {/* Sales Trends Chart */}
          <SalesChart data={salesData} />

          {/* Recent Orders List */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-earth-100 dark:border-earth-800">
              <h3 className="text-base font-bold text-earth-900 dark:text-white">
                Recent Customer Orders
              </h3>
              <Link
                to="/farmer/orders"
                className="text-xs font-semibold text-forest-600 hover:text-forest-700 dark:text-forest-400 flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-earth-400 text-center py-6">
                No orders received yet. Keep your harvest listings updated to attract buyers!
              </p>
            ) : (
              <div className="divide-y divide-earth-100 dark:divide-earth-800">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm">
                    <div>
                      <p className="font-bold text-earth-900 dark:text-white">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-earth-500">
                        {order.buyer?.name || 'Customer'} • {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-forest-700 dark:text-forest-400">
                        {formatCurrency(order.totalAmount)}
                      </span>
                      <Badge variant="earth" size="sm" className="capitalize">
                        {order.orderStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default FarmerDashboard;
