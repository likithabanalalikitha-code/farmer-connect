import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Sprout, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { showToast } from '../components/common/Toast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Login = ({ adminOnly = false }) => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/marketplace';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const loggedInUser = await login(formData);
      if ((adminOnly && loggedInUser.role !== 'admin') || (!adminOnly && loggedInUser.role === 'admin')) {
        logout();
        throw new Error('This sign-in is reserved for administrators.');
      }
      showToast(`Welcome back, ${loggedInUser.name}!`, 'success');

      if (loggedInUser.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else if (loggedInUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (loggedInUser.role === 'delivery-agent') {
        navigate('/delivery/orders');
      } else {
        navigate(from === '/login' ? '/marketplace' : from);
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo account filler
  const fillDemo = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-forest-600 flex items-center justify-center text-white shadow-sm">
              <Sprout className="w-6 h-6 text-forest-200" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white tracking-tight">
            Sign In to Your Account
          </h2>
          <p className="text-xs sm:text-sm text-earth-500 dark:text-earth-400">
            Access direct farmer markets, order history, and AI assistance
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="p-3.5 rounded-2xl bg-forest-50/80 dark:bg-forest-950/40 border border-forest-200/80 dark:border-forest-900/80 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-forest-800 dark:text-forest-300 text-center">
            Quick Fill Demo Accounts:
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            {!adminOnly && <button
              type="button"
              onClick={() => fillDemo('ramesh.farmer@example.com', 'Password123!')}
              className="px-2 py-1.5 rounded-xl bg-white dark:bg-earth-900 border border-forest-200 dark:border-forest-800 text-[11px] font-semibold text-forest-800 dark:text-forest-200 hover:bg-forest-100 transition-colors"
            >
              👩‍🌾 Farmer
            </button>}
            {!adminOnly && <button
              type="button"
              onClick={() => fillDemo('priya.buyer@example.com', 'Password123!')}
              className="px-2 py-1.5 rounded-xl bg-white dark:bg-earth-900 border border-forest-200 dark:border-forest-800 text-[11px] font-semibold text-forest-800 dark:text-forest-200 hover:bg-forest-100 transition-colors"
            >
              🛒 Consumer
            </button>}
            {adminOnly && <button
              type="button"
              onClick={() => fillDemo('admin@farmermarket.com', 'Admin@123456')}
              className="px-2 py-1.5 rounded-xl bg-white dark:bg-earth-900 border border-forest-200 dark:border-forest-800 text-[11px] font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-50 transition-colors"
            >
              🛡️ Admin
            </button>}
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-earth-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-forest-600 dark:text-forest-400 hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
