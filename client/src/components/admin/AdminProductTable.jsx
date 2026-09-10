import React from 'react';
import { Eye, EyeOff, Trash2, Sprout } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Badge from '../common/Badge';

const AdminProductTable = ({ products = [], onToggleStatus, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-earth-200/80 dark:border-earth-800/80 bg-white dark:bg-earth-900 shadow-subtle">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-earth-200 dark:border-earth-800 bg-earth-50/70 dark:bg-earth-950/40 text-earth-600 dark:text-earth-400 font-bold uppercase tracking-wider text-[11px]">
            <th className="py-3.5 px-4">Produce</th>
            <th className="py-3.5 px-4">Farmer</th>
            <th className="py-3.5 px-4">Price</th>
            <th className="py-3.5 px-4">Available</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Moderation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-earth-100 dark:divide-earth-800/80">
          {products.map((p) => {
            const img = p.images && p.images.length > 0
              ? p.images[0]
              : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';

            return (
              <tr key={p._id} className="hover:bg-earth-50/50 dark:hover:bg-earth-800/40 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={img}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover border border-earth-200 dark:border-earth-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-earth-900 dark:text-white truncate max-w-[170px]">
                        {p.name}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-earth-400">
                        <span>{p.category}</span>
                        {p.organic && <span className="text-forest-600 font-semibold">• Organic</span>}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <p className="font-medium text-earth-900 dark:text-white truncate max-w-[140px]">
                    {p.farmer?.farmName || p.farmer?.name || 'Local Farmer'}
                  </p>
                  <p className="text-[11px] text-earth-400 truncate max-w-[140px]">
                    {p.location}
                  </p>
                </td>

                <td className="py-3 px-4 font-bold text-forest-700 dark:text-forest-400">
                  {formatCurrency(p.price)} <span className="text-[11px] font-normal text-earth-500">/ {p.unit}</span>
                </td>

                <td className="py-3 px-4 font-semibold text-earth-800 dark:text-earth-200">
                  {p.availableQuantity} {p.unit}
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      p.isActive
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-earth-100 text-earth-500 dark:bg-earth-800 dark:text-earth-400'
                    }`}
                  >
                    {p.isActive ? 'Active' : 'Unlisted'}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onToggleStatus(p._id, !p.isActive)}
                      className="p-1.5 rounded-lg border border-earth-200 dark:border-earth-700 hover:bg-earth-100 dark:hover:bg-earth-800 text-earth-600 dark:text-earth-300 transition-colors"
                      title={p.isActive ? 'Delist Listing' : 'Make Active'}
                    >
                      {p.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-forest-600" />}
                    </button>
                    <button
                      onClick={() => onDelete(p._id)}
                      className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 transition-colors"
                      title="Permanently Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductTable;
