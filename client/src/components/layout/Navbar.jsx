import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Menu,
  X,
  Sun,
  Moon,
  Bot,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Package,
  ShoppingBag as OrdersIcon,
  ShieldAlert,
  Sprout
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useTheme } from '../../hooks/useTheme';
import { useAI } from '../../hooks/useAI';
import Button from '../common/Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { toggleAssistant } = useAI();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-earth-200/80 dark:border-earth-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-forest-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6 text-forest-200" />
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-earth-900 dark:text-white flex items-center gap-1.5">
              Farmer Market <span className="text-forest-600 dark:text-forest-400">Connect</span>
            </span>
            <span className="hidden sm:block text-[10px] text-earth-500 dark:text-earth-400 font-medium tracking-wide uppercase">
              Direct Farm Produce
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/marketplace"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive('/marketplace')
                ? 'bg-forest-50 text-forest-700 dark:bg-forest-950 dark:text-forest-300'
                : 'text-earth-700 hover:text-forest-600 dark:text-earth-300 dark:hover:text-forest-400'
            }`}
          >
            Marketplace
          </Link>

          {/* Role specific shortcuts */}
          {isAuthenticated && user?.role === 'consumer' && (
            <Link
              to="/orders"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/orders')
                  ? 'bg-forest-50 text-forest-700 dark:bg-forest-950 dark:text-forest-300'
                  : 'text-earth-700 hover:text-forest-600 dark:text-earth-300 dark:hover:text-forest-400'
              }`}
            >
              My Orders
            </Link>
          )}

          {isAuthenticated && user?.role === 'farmer' && (
            <>
              <Link
                to="/farmer/dashboard"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/farmer/dashboard')
                    ? 'bg-forest-50 text-forest-700 dark:bg-forest-950 dark:text-forest-300'
                    : 'text-earth-700 hover:text-forest-600 dark:text-earth-300 dark:hover:text-forest-400'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/farmer/products"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/farmer/products')
                    ? 'bg-forest-50 text-forest-700 dark:bg-forest-950 dark:text-forest-300'
                    : 'text-earth-700 hover:text-forest-600 dark:text-earth-300 dark:hover:text-forest-400'
                }`}
              >
                My Crops
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive('/admin/dashboard')
                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                  : 'text-earth-700 hover:text-purple-600 dark:text-earth-300 dark:hover:text-purple-400'
              }`}
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Assistant Quick Pill */}
          <button
            onClick={toggleAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-forest-600 to-emerald-600 text-white hover:shadow-glow-green transition-all transform hover:scale-[1.03] active:scale-95"
            title="Ask AI Market Assistant"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-earth-600 dark:text-earth-300 hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-earth-600" />}
          </button>

          {/* Shopping Cart Button */}
          <Link
            to="/cart"
            className="relative p-2 rounded-xl text-earth-700 dark:text-earth-200 hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-forest-600 text-white text-[10px] font-bold flex items-center justify-center animate-scale-in">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Account / Login State */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-earth-300 dark:border-earth-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-forest-100 dark:bg-forest-900 text-forest-700 dark:text-forest-300 font-bold flex items-center justify-center text-xs">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <span className="hidden lg:block text-xs font-semibold text-earth-800 dark:text-earth-200 max-w-[90px] truncate">
                  {user?.name}
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-earth-900 rounded-2xl shadow-xl border border-earth-200 dark:border-earth-800 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-earth-100 dark:border-earth-800">
                    <p className="text-sm font-semibold text-earth-900 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-earth-500 dark:text-earth-400 capitalize">
                      {user?.role} Account
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-earth-700 dark:text-earth-300 hover:bg-earth-50 dark:hover:bg-earth-800"
                  >
                    <UserIcon className="w-4 h-4 text-earth-400" />
                    <span>My Profile</span>
                  </Link>

                  {user?.role === 'farmer' && (
                    <Link
                      to="/farmer/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-earth-700 dark:text-earth-300 hover:bg-earth-50 dark:hover:bg-earth-800"
                    >
                      <LayoutDashboard className="w-4 h-4 text-forest-500" />
                      <span>Farmer Dashboard</span>
                    </Link>
                  )}

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-earth-700 dark:text-earth-300 hover:bg-earth-50 dark:hover:bg-earth-800"
                    >
                      <ShieldAlert className="w-4 h-4 text-purple-500" />
                      <span>Admin Console</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Join Market
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-earth-700 dark:text-earth-300 hover:bg-earth-100 dark:hover:bg-earth-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-earth-200 dark:border-earth-800 bg-white dark:bg-earth-900 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-earth-800 dark:text-earth-200"
          >
            Explore Marketplace
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-earth-800 dark:text-earth-200"
              >
                My Orders
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-earth-800 dark:text-earth-200"
              >
                Profile Settings
              </Link>
              {user?.role === 'farmer' && (
                <Link
                  to="/farmer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-forest-600 dark:text-forest-400"
                >
                  Farmer Dashboard
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-purple-600 dark:text-purple-400"
                >
                  Admin Console
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left py-2 text-base font-medium text-red-600"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="md" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
