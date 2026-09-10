import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Users,
  Layers,
  Settings,
  Bot,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ role = 'farmer' }) => {
  const { user } = useAuth();

  const farmerLinks = [
    { name: 'Dashboard', to: '/farmer/dashboard', icon: LayoutDashboard },
    { name: 'My Products', to: '/farmer/products', icon: Package },
    { name: 'Add Product', to: '/farmer/products/add', icon: PlusCircle },
    { name: 'Customer Orders', to: '/farmer/orders', icon: ShoppingBag },
    { name: 'Farm Profile', to: '/profile', icon: Settings }
  ];

  const adminLinks = [
    { name: 'Admin Overview', to: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', to: '/admin/users', icon: Users },
    { name: 'Product Moderation', to: '/admin/products', icon: Package },
    { name: 'Platform Orders', to: '/admin/orders', icon: ShoppingBag }
  ];

  const deliveryLinks = [
    { name: 'Delivery Queue', to: '/delivery/orders', icon: ShoppingBag },
    { name: 'Profile', to: '/profile', icon: Settings }
  ];

  const links = role === 'admin' ? adminLinks : role === 'delivery-agent' ? deliveryLinks : farmerLinks;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white dark:bg-earth-900 rounded-3xl border border-earth-200/80 dark:border-earth-800/80 p-4 shadow-subtle sticky top-24">
        {/* User Card */}
        <div className="flex items-center gap-3 p-3 mb-4 rounded-2xl bg-forest-50/70 dark:bg-forest-950/40 border border-forest-100 dark:border-forest-900/60">
          <div className="w-10 h-10 rounded-xl bg-forest-600 text-white font-bold flex items-center justify-center shrink-0">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-earth-900 dark:text-white truncate">
              {user?.name}
            </h4>
            <p className="text-xs text-forest-700 dark:text-forest-400 capitalize">
              {user?.farmName || `${user?.role} Portal`}
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/farmer/dashboard' || link.to === '/admin/dashboard'}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${
                    isActive
                      ? role === 'admin'
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 font-semibold'
                        : 'bg-forest-600 text-white shadow-sm'
                      : 'text-earth-600 dark:text-earth-400 hover:bg-earth-100 dark:hover:bg-earth-800 hover:text-earth-900 dark:hover:text-white'
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
