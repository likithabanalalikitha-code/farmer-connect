import React from 'react';
import { Users, Sprout, ShoppingBag, TrendingUp, ShieldCheck, Package } from 'lucide-react';
import DashboardCard from '../farmer/DashboardCard';
import { formatCurrency } from '../../utils/formatters';

const AdminStats = ({ counts = {} }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        title="Total Revenue"
        value={formatCurrency(counts.totalRevenue || 0)}
        subtitle="Gross verified market GMV"
        icon={TrendingUp}
        variant="forest"
      />
      <DashboardCard
        title="Active Produce"
        value={`${counts.activeProducts || 0} / ${counts.totalProducts || 0}`}
        subtitle="Live agricultural listings"
        icon={Package}
        variant="harvest"
      />
      <DashboardCard
        title="Platform Orders"
        value={counts.totalOrders || 0}
        subtitle="Completed & ongoing trades"
        icon={ShoppingBag}
        variant="blue"
      />
      <DashboardCard
        title="Registered Farmers"
        value={counts.totalFarmers || 0}
        subtitle="Verified rural crop growers"
        icon={Sprout}
        variant="forest"
      />
      <DashboardCard
        title="Consumer Accounts"
        value={counts.totalConsumers || 0}
        subtitle="Active farm buyers"
        icon={Users}
        variant="purple"
      />
      <DashboardCard
        title="Total Members"
        value={counts.totalUsers || 0}
        subtitle="Platform user base"
        icon={ShieldCheck}
        variant="harvest"
      />
    </div>
  );
};

export default AdminStats;
