import React from 'react';
import { UserCheck, UserX, Shield, Sprout, ShoppingCart } from 'lucide-react';
import Badge from '../common/Badge';

const roleBadges = {
  admin: { variant: 'purple', icon: Shield },
  farmer: { variant: 'forest', icon: Sprout },
  consumer: { variant: 'blue', icon: ShoppingCart }
};

const UserTable = ({ users = [], onToggleStatus }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-earth-200/80 dark:border-earth-800/80 bg-white dark:bg-earth-900 shadow-subtle">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-earth-200 dark:border-earth-800 bg-earth-50/70 dark:bg-earth-950/40 text-earth-600 dark:text-earth-400 font-bold uppercase tracking-wider text-[11px]">
            <th className="py-3.5 px-4">User</th>
            <th className="py-3.5 px-4">Role</th>
            <th className="py-3.5 px-4">Contact</th>
            <th className="py-3.5 px-4">Location</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Moderation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-earth-100 dark:divide-earth-800/80">
          {users.map((u) => {
            const roleInfo = roleBadges[u.role] || roleBadges.consumer;
            const RoleIcon = roleInfo.icon;

            return (
              <tr key={u._id} className="hover:bg-earth-50/50 dark:hover:bg-earth-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {u.avatar ? (
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-xl object-cover border border-earth-200 dark:border-earth-700 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-forest-100 dark:bg-forest-950 text-forest-700 dark:text-forest-300 font-bold flex items-center justify-center shrink-0">
                        {u.name ? u.name[0].toUpperCase() : 'U'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-earth-900 dark:text-white truncate max-w-[160px]">
                        {u.name}
                      </p>
                      <p className="text-[11px] text-earth-400 truncate max-w-[160px]">
                        {u.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <Badge variant={roleInfo.variant} size="sm" icon={RoleIcon} className="capitalize">
                    {u.role}
                  </Badge>
                </td>

                <td className="py-3 px-4 text-earth-600 dark:text-earth-400">
                  {u.phone || '—'}
                </td>

                <td className="py-3 px-4 text-earth-600 dark:text-earth-400">
                  {u.city ? `${u.city}, ${u.state || ''}` : '—'}
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      u.isActive
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                    }`}
                  >
                    {u.isActive ? 'Active' : 'Suspended'}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onToggleStatus(u._id, !u.isActive)}
                    className={`p-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
                      u.isActive
                        ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/40'
                        : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/50 dark:hover:bg-emerald-950/40'
                    }`}
                    title={u.isActive ? 'Suspend User' : 'Reactivate User'}
                  >
                    {u.isActive ? (
                      <>
                        <UserX className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Suspend</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Activate</span>
                      </>
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
