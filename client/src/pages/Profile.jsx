import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Sprout, Bell, Check, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { showToast } from '../components/common/Toast';
import { formatDate } from '../utils/formatters';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const Profile = () => {
  const { user, refreshProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'notifications'
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    farmName: user?.farmName || '',
    farmDescription: user?.farmDescription || ''
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        farmName: user.farmName || '',
        farmDescription: user.farmDescription || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await userService.getNotifications();
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      } catch {
        // silent
      }
    };
    fetchNotifs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await userService.updateProfile(formData);
      await refreshProfile();
      showToast('Profile information successfully saved!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await userService.markNotificationRead('all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      showToast('All notifications marked as read', 'info');
    } catch (err) {
      showToast('Could not mark notifications as read', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with User Avatar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-earth-900 border border-earth-200 dark:border-earth-800 shadow-subtle">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-forest-600 text-white text-2xl font-bold flex items-center justify-center shrink-0">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-earth-950 dark:text-white">
              {user?.name}
            </h1>
            <p className="text-xs text-earth-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant={user?.role === 'farmer' ? 'forest' : user?.role === 'admin' ? 'purple' : 'blue'} size="sm" className="capitalize">
                {user?.role} Account
              </Badge>
              {user?.farmName && (
                <span className="text-xs text-forest-700 dark:text-forest-400 font-semibold">
                  🌾 {user.farmName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'details'
                ? 'bg-forest-600 text-white shadow-sm'
                : 'bg-earth-100 dark:bg-earth-800 text-earth-600 dark:text-earth-300'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'notifications'
                ? 'bg-forest-600 text-white shadow-sm'
                : 'bg-earth-100 dark:bg-earth-800 text-earth-600 dark:text-earth-300'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-forest-700 text-white text-[10px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'details' ? (
        <form onSubmit={handleSave} className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-earth-900 dark:text-white flex items-center gap-2 pb-3 border-b border-earth-100 dark:border-earth-800">
              <User className="w-4 h-4 text-forest-600" />
              <span>Personal Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Contact Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
            </div>

            {user?.role === 'farmer' && (
              <div className="pt-4 border-t border-earth-100 dark:border-earth-800 space-y-4">
                <Input
                  label="Farm / Cooperative Name"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  placeholder="e.g. Green Valley Farm"
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 dark:text-earth-300 mb-1.5">
                    Farm Narrative & Agricultural Methods
                  </label>
                  <textarea
                    rows={3}
                    name="farmDescription"
                    value={formData.farmDescription}
                    onChange={handleChange}
                    placeholder="Tell buyers about your crop varieties, natural fertilizers, and harvest calendar..."
                    className="w-full text-sm rounded-xl border border-earth-300 dark:border-earth-700 bg-white dark:bg-earth-900 p-3 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-earth-900 dark:text-white flex items-center gap-2 pb-3 border-b border-earth-100 dark:border-earth-800">
              <MapPin className="w-4 h-4 text-forest-600" />
              <span>Default Address</span>
            </h3>

            <Input
              label="Street Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. Village Khed, Post Dindori"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="City / District"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Nashik"
              />
              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Maharashtra"
              />
              <Input
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="e.g. 422004"
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Save}
              isLoading={isSaving}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      ) : (
        /* Notifications View */
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-earth-100 dark:border-earth-800">
            <h3 className="text-base font-bold text-earth-900 dark:text-white">
              Notifications & Order Alerts
            </h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-semibold text-forest-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-xs text-earth-400 text-center py-8">
              You have no new notifications.
            </p>
          ) : (
            <div className="divide-y divide-earth-100 dark:divide-earth-800">
              {notifications.map((n) => (
                <div key={n._id} className="py-3 flex items-start gap-3">
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      n.isRead ? 'bg-earth-300 dark:bg-earth-700' : 'bg-forest-600'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs sm:text-sm font-bold text-earth-900 dark:text-white">
                      {n.title}
                    </h5>
                    <p className="text-xs text-earth-600 dark:text-earth-400 mt-0.5">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-earth-400 mt-1 block">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Profile;
