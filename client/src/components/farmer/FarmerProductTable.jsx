import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Eye, EyeOff, Sprout, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import Button from '../common/Button';

const FarmerProductTable = ({
  products = [],
  onDelete,
  onToggleStatus
}) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const confirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget._id);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-earth-200/80 dark:border-earth-800/80 bg-white dark:bg-earth-900 shadow-subtle">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-earth-200 dark:border-earth-800 bg-earth-50/70 dark:bg-earth-950/40 text-earth-600 dark:text-earth-400 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Crop Produce</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price / Unit</th>
              <th className="py-3.5 px-4">Available Stock</th>
              <th className="py-3.5 px-4">Organic</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-earth-100 dark:divide-earth-800/80">
            {products.map((product) => {
              const img = product.images && product.images.length > 0
                ? product.images[0]
                : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80';

              return (
                <tr
                  key={product._id}
                  className="hover:bg-earth-50/50 dark:hover:bg-earth-800/40 transition-colors"
                >
                  {/* Crop Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={img}
                        alt={product.name}
                        className="w-11 h-11 rounded-xl object-cover border border-earth-200 dark:border-earth-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-earth-900 dark:text-white truncate max-w-[180px]">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-earth-400 truncate max-w-[160px]">
                          {product.location}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <Badge variant="earth" size="sm">
                      {product.category}
                    </Badge>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-bold text-forest-700 dark:text-forest-400">
                    {formatCurrency(product.price)} <span className="text-[11px] font-normal text-earth-500">/ {product.unit}</span>
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4">
                    <span className={`font-semibold ${product.availableQuantity <= 10 ? 'text-red-600' : 'text-earth-800 dark:text-earth-200'}`}>
                      {product.availableQuantity} {product.unit}
                    </span>
                  </td>

                  {/* Organic */}
                  <td className="py-3 px-4">
                    {product.organic ? (
                      <span className="text-forest-600 flex items-center gap-1 font-semibold text-xs">
                        <Sprout className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : (
                      <span className="text-earth-400 text-xs">No</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onToggleStatus(product._id, !product.isActive)}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                        product.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-earth-100 text-earth-500 border-earth-300 dark:bg-earth-800 dark:text-earth-400'
                      }`}
                    >
                      {product.isActive ? (
                        <>
                          <Eye className="w-3 h-3" /> Live
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" /> Paused
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/farmer/products/${product._id}/edit`}
                        className="p-1.5 rounded-lg text-earth-500 hover:text-forest-600 hover:bg-forest-50 dark:hover:bg-forest-950/50 transition-colors"
                        title="Edit Harvest"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(product)}
                        className="p-1.5 rounded-lg text-earth-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                        title="Delete Harvest"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Removal"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-earth-900 dark:text-white">
                Delete "{deleteTarget?.name}"?
              </h4>
              <p className="text-xs text-earth-500 mt-1">
                Are you sure you want to permanently remove this crop listing from the marketplace? This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={confirmDelete}
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FarmerProductTable;
