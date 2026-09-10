import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sprout, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { showToast } from '../common/Toast';
import Card from '../common/Card';
import Badge from '../common/Badge';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80';
  const productImage = product.images && product.images.length > 0 ? product.images[0] : fallbackImage;
  const isOutOfStock = product.availableQuantity <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(product, 1);
    setIsAdded(true);
    showToast(`Added ${product.name} to cart!`, 'success');

    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const farmerDisplay =
    product.farmer?.farmName || product.farmer?.name || 'Verified Local Farmer';

  return (
    <Card hoverable className="overflow-hidden flex flex-col h-full group">
      <Link to={`/products/${product._id}`} className="block relative aspect-[4/3] overflow-hidden bg-earth-100 dark:bg-earth-800">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.organic && (
            <Badge variant="forest" size="sm" icon={Sprout} className="shadow-sm">
              ORGANIC
            </Badge>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5 z-10">
          <Badge variant="earth" size="sm" className="bg-black/60 text-white backdrop-blur-md border-0">
            {product.category}
          </Badge>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Farm Name & Location */}
          <div className="flex items-center justify-between text-xs text-earth-500 dark:text-earth-400 mb-1">
            <span className="flex items-center gap-1 font-medium truncate max-w-[140px]">
              🌾 {farmerDisplay}
            </span>
            <span className="flex items-center gap-0.5 truncate max-w-[110px]">
              <MapPin className="w-3 h-3 text-forest-600 shrink-0" />
              {product.location}
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/products/${product._id}`}>
            <h3 className="font-bold text-sm sm:text-base text-earth-900 dark:text-white line-clamp-1 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Stock info */}
        <div className="pt-2 border-t border-earth-100 dark:border-earth-800 flex items-center justify-between">
          <div>
            <div className="text-base sm:text-lg font-extrabold text-forest-700 dark:text-forest-400">
              {formatCurrency(product.price)}{' '}
              <span className="text-xs font-medium text-earth-500 dark:text-earth-400">
                / {product.unit}
              </span>
            </div>
            <p className="text-[11px] text-earth-500">
              {product.availableQuantity} {product.unit} available
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`
              p-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all
              ${
                isAdded
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isOutOfStock
                  ? 'bg-earth-200 dark:bg-earth-800 text-earth-400 cursor-not-allowed'
                  : 'bg-forest-600 hover:bg-forest-700 text-white shadow-sm hover:shadow-glow-green active:scale-95'
              }
            `}
            aria-label="Add to cart"
            title="Add to cart"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
