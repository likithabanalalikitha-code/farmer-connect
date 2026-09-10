import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Sprout, ShoppingBag, Truck, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { showToast } from '../components/common/Toast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('consumer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    farmDescription: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const registeredUser = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role,
        farmName: role === 'farmer' ? formData.farmName.trim() : '',
        farmDescription: role === 'farmer' ? formData.farmDescription.trim() : ''
      });

      showToast(`Welcome to Farmer Market Connect, ${registeredUser.name}!`, 'success');

      if (registeredUser.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else if (registeredUser.role === 'delivery-agent') {
        navigate('/delivery/orders');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-forest-600 flex items-center justify-center text-white shadow-sm">
              <Sprout className="w-6 h-6 text-forest-200" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs sm:text-sm text-earth-500 dark:text-earth-400">
            Choose your account type to get started with direct agricultural trade
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 rounded-2xl bg-earth-200/80 dark:bg-earth-900 border border-earth-300 dark:border-earth-800">
          <button
            type="button"
            onClick={() => setRole('consumer')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              role === 'consumer'
                ? 'bg-white dark:bg-earth-800 text-forest-700 dark:text-forest-300 shadow-sm'
                : 'text-earth-600 dark:text-earth-400 hover:text-earth-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Consumer / Buyer</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('delivery-agent')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              role === 'delivery-agent'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-earth-600 dark:text-earth-400 hover:text-earth-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Delivery Agent</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              role === 'farmer'
                ? 'bg-forest-600 text-white shadow-sm'
                : 'text-earth-600 dark:text-earth-400 hover:text-earth-900'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Farmer / Producer</span>
          </button>
        </div>

        {/* Registration Card */}
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              type="text"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Patel"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                label="Phone Number"
                name="phone"
                type="tel"
                icon={Phone}
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
            </div>

            {role === 'farmer' && (
              <div className="space-y-4 pt-2 border-t border-earth-100 dark:border-earth-800 animate-in fade-in">
                <Input
                  label="Farm / Orchard Name"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  placeholder="e.g. Green Valley Organic Agro"
                  helperText="Your farm or cooperative name displayed to buyers"
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 dark:text-earth-300 mb-1.5">
                    About Your Farm Practices
                  </label>
                  <textarea
                    rows={2}
                    name="farmDescription"
                    value={formData.farmDescription}
                    onChange={handleChange}
                    placeholder="Briefly describe your crops, farming methods, or location..."
                    className="w-full text-sm rounded-xl border border-earth-300 dark:border-earth-700 bg-white dark:bg-earth-900 p-3 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password (min 8)"
                name="password"
                type="password"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
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
              isLoading={isLoading}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full"
            >
              {role === 'farmer' ? 'Register as Farmer' : role === 'delivery-agent' ? 'Register as Delivery Agent' : 'Register as Consumer'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-earth-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-forest-600 dark:text-forest-400 hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
