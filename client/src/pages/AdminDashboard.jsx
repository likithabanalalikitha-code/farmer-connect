import React, { useState, useEffect } from 'react';
import { PlusCircle, Layers, Users, ShoppingBag, Bot, Package } from 'lucide-react';
import { adminService } from '../services/userService';
import { showToast } from '../components/common/Toast';
import Sidebar from '../components/layout/Sidebar';
import AdminStats from '../components/admin/AdminStats';
import CategoryModal from '../components/admin/CategoryModal';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, catRes, aiRes] = await Promise.all([
        adminService.getStats(),
        adminService.getCategories(),
        adminService.getAISummary()
      ]);
      setStats(statsRes.data);
      setCategories(catRes.data.categories || []);
      setAiSummary(aiRes.data);
    } catch (err) {
      showToast(err.message || 'Failed to load administration data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSaveCategory = async (catData, existingId) => {
    if (existingId) {
      await adminService.updateCategory(existingId, catData);
      showToast('Category updated successfully', 'success');
    } else {
      await adminService.createCategory(catData);
      showToast('New category created', 'success');
    }
    const catRes = await adminService.getCategories();
    setCategories(catRes.data.categories || []);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category? Products in this category will remain.')) return;
    try {
      await adminService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      showToast('Category removed', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to delete category.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Sidebar role="admin" />

        <main className="flex-1 w-full space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white tracking-tight">
              Platform Administration
            </h1>
            <p className="text-xs sm:text-sm text-earth-500">
              Overview of marketplace transactions, users, catalog categories, and AI queries
            </p>
          </div>

          {/* Stats Overview */}
          <AdminStats counts={stats?.counts || {}} />

          {/* Categories Management Panel */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-earth-100 dark:border-earth-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-forest-600" />
                <h3 className="text-base font-bold text-earth-900 dark:text-white">
                  Agricultural Categories ({categories.length})
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={PlusCircle}
                onClick={() => {
                  setEditCategory(null);
                  setCategoryModalOpen(true);
                }}
              >
                Add Category
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="p-3 rounded-2xl border border-earth-200 dark:border-earth-800 bg-earth-50/50 dark:bg-earth-800/40 flex items-center justify-between group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-earth-900 dark:text-white truncate">
                      {cat.name}
                    </p>
                    <p className="text-[10px] text-earth-400">/{cat.slug}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setEditCategory(cat);
                        setCategoryModalOpen(true);
                      }}
                      className="text-[11px] text-forest-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="text-[11px] text-red-500 hover:underline ml-1"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Usage Activity Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-earth-100 dark:border-earth-800">
              <Bot className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-earth-900 dark:text-white">
                Groq AI Assistant Engagement
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Total AI Sessions
                </span>
                <p className="text-3xl font-extrabold text-purple-900 dark:text-purple-100 mt-1">
                  {aiSummary?.totalConversations || 0}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Conversations stored with context injection
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-forest-50/60 dark:bg-forest-950/30 border border-forest-200/60 dark:border-forest-900/40">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-forest-300">
                  Active Model
                </span>
                <p className="text-xl font-extrabold text-forest-900 dark:text-forest-100 mt-1 truncate">
                  llama-3.1-8b-instant
                </p>
                <p className="text-xs text-forest-600 dark:text-forest-400 mt-1">
                  Groq Cloud Inference Engine
                </p>
              </div>
            </div>
          </Card>
        </main>
      </div>

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        category={editCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default AdminDashboard;
