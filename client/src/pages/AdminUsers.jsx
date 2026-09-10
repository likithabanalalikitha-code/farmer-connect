import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { adminService } from '../services/userService';
import { showToast } from '../components/common/Toast';
import Sidebar from '../components/layout/Sidebar';
import UserTable from '../components/admin/UserTable';
import Pagination from '../components/common/Pagination';
import Spinner from '../components/common/Spinner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async (page = 1) => {
    try {
      setIsLoading(true);
      const params = { page, limit: 10 };
      if (roleFilter !== 'all') params.role = roleFilter;
      if (search.trim()) params.search = search.trim();

      const res = await adminService.getUsers(params);
      setUsers(res.data || []);
      if (res.meta) setPagination(res.meta);
    } catch (err) {
      showToast(err.message || 'Failed to load users.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleToggleStatus = async (userId, newActiveState) => {
    try {
      await adminService.updateUserStatus(userId, { isActive: newActiveState });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: newActiveState } : u))
      );
      showToast(newActiveState ? 'User activated' : 'User account suspended', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to update user status.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Sidebar role="admin" />

        <main className="flex-1 w-full space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white tracking-tight">
              User Moderation
            </h1>
            <p className="text-xs sm:text-sm text-earth-500">
              Manage platform farmers, consumers, and administrative access
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
              <Search className="absolute left-3 w-4 h-4 text-earth-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-earth-300 dark:border-earth-700 bg-white dark:bg-earth-900 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </form>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              {['all', 'farmer', 'consumer', 'delivery-agent', 'admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold capitalize transition-colors ${
                    roleFilter === role
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white dark:bg-earth-900 border border-earth-200 dark:border-earth-800 text-earth-600 dark:text-earth-400'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="space-y-4">
              <UserTable users={users} onToggleStatus={handleToggleStatus} />
              {pagination.pages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={(p) => fetchUsers(p)}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
