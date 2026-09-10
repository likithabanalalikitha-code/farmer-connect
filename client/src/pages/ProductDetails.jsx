import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Sprout,
  ShoppingBag,
  ArrowLeft,
  Check,
  ShieldCheck,
  Phone,
  Truck,
  RotateCcw
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatters';
import { showToast } from '../components/common/Toast';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import ErrorState from '../components/common/ErrorState';
import ProductCard from '../components/marketplace/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await productService.getProductById(id);
        const data = res.data.product;
        setProduct(data);
        setActiveImage(data.images && data.images.length > 0 ? data.images[0] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80');

        // Fetch related products in the same category
        if (data.category) {
          const relRes = await productService.getProducts({ category: data.category, limit: 4 });
          setRelatedProducts((relRes.data || []).filter((p) => p._id !== data._id).slice(0, 3));
        }
      } catch (err) {
        setError(err.message || 'Failed to load product details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState
          title="Product not available"
          message={error || 'This agricultural produce listing could not be found.'}
          onRetry={() => navigate('/marketplace')}
        />
      </div>
    );
  }

  const isOutOfStock = product.availableQuantity <= 0;
  const maxAllowed = Math.min(product.availableQuantity || 1, 999);

  const handleQtyChange = (delta) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, maxAllowed)));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    showToast(`Added ${quantity} ${product.unit} of ${product.name} to cart!`, 'success');
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back to Marketplace */}
      <div>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth-500 hover:text-forest-600 dark:hover:text-forest-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-earth-200 dark:border-earth-800 bg-earth-100 dark:bg-earth-800 shadow-subtle relative">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.organic && (
              <div className="absolute top-4 left-4">
                <Badge variant="forest" size="md" icon={Sprout}>
                  CERTIFIED ORGANIC
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img
                      ? 'border-forest-600 shadow-md scale-105'
                      : 'border-earth-200 dark:border-earth-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="earth" size="sm">
                {product.category}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-earth-500">
                <MapPin className="w-3.5 h-3.5 text-forest-600" />
                {product.location}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* Price Tag */}
          <div className="p-4 rounded-2xl bg-forest-50/70 dark:bg-forest-950/40 border border-forest-200 dark:border-forest-900/60 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-forest-700 dark:text-forest-400">
              {formatCurrency(product.price)}
            </span>
            <span className="text-sm font-semibold text-earth-600 dark:text-earth-400">
              / {product.unit}
            </span>
            <span className="text-xs text-earth-400 ml-auto">
              (Direct Farm Price)
            </span>
          </div>

          {/* Stock Availability */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-earth-700 dark:text-earth-300">Availability:</span>
            {isOutOfStock ? (
              <span className="font-bold text-red-600">Currently Out of Stock</span>
            ) : (
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {product.availableQuantity} {product.unit} ready for harvest/shipping
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-earth-700 dark:text-earth-300">
              Harvest & Crop Overview
            </h3>
            <p className="text-sm text-earth-600 dark:text-earth-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Quantity selector and Cart buttons */}
          {!isOutOfStock && (
            <div className="space-y-4 pt-4 border-t border-earth-100 dark:border-earth-800">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-earth-700 dark:text-earth-300">
                  Quantity ({product.unit}):
                </span>
                <div className="flex items-center rounded-xl border border-earth-300 dark:border-earth-700 bg-white dark:bg-earth-900 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleQtyChange(-1)}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2 text-earth-600 dark:text-earth-300 hover:bg-earth-100 dark:hover:bg-earth-800 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-earth-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQtyChange(1)}
                    disabled={quantity >= maxAllowed}
                    className="px-3.5 py-2 text-earth-600 dark:text-earth-300 hover:bg-earth-100 dark:hover:bg-earth-800 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-earth-500">
                  Subtotal: <strong className="text-earth-900 dark:text-white">{formatCurrency(product.price * quantity)}</strong>
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  size="lg"
                  icon={ShoppingBag}
                  className="flex-1"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  Buy Now (Cash on Delivery)
                </Button>
              </div>
            </div>
          )}

          {/* Farmer Card */}
          <Card className="p-5 mt-6 border-forest-100 dark:border-forest-900/60 bg-forest-50/40 dark:bg-forest-950/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-forest-400 mb-3 flex items-center gap-1.5">
              <Sprout className="w-4 h-4" />
              Produced Directly By
            </h4>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-forest-600 text-white font-bold flex items-center justify-center shrink-0">
                {product.farmer?.name ? product.farmer.name[0].toUpperCase() : 'F'}
              </div>
              <div className="space-y-1 min-w-0">
                <h5 className="text-sm font-bold text-earth-900 dark:text-white truncate">
                  {product.farmer?.name || 'Local Farmer'}
                </h5>
                <p className="text-xs text-forest-700 dark:text-forest-400 font-semibold">
                  {product.farmer?.farmName || 'Verified Family Farm'}
                </p>
                {product.farmer?.farmDescription && (
                  <p className="text-xs text-earth-600 dark:text-earth-400 line-clamp-2">
                    {product.farmer.farmDescription}
                  </p>
                )}
                <p className="text-[11px] text-earth-500 pt-1">
                  Location: {product.farmer?.city || product.location}, {product.farmer?.state || 'India'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-earth-200 dark:border-earth-800 space-y-6">
          <h3 className="text-xl font-bold text-earth-900 dark:text-white">
            More Fresh Produce in {product.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
