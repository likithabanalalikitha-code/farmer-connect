import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sprout, Save } from 'lucide-react';
import { productService } from '../services/productService';
import { useAuth } from '../hooks/useAuth';
import { CATEGORIES, UNITS } from '../utils/constants';
import { showToast } from '../components/common/Toast';
import Sidebar from '../components/layout/Sidebar';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import ImageUpload from '../components/common/ImageUpload';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const AddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    quantity: '',
    availableQuantity: '',
    location: user?.city ? `${user.city}, ${user.state || 'India'}` : '',
    organic: false,
    images: []
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const handleImagesChange = (imgs) => {
    setFormData({ ...formData, images: imgs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Product description is required.');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please provide a valid price greater than 0.');
      return;
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      setError('Total harvest quantity is required.');
      return;
    }
    if (!formData.location.trim()) {
      setError('Produce harvest location is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        unit: formData.unit,
        quantity: parseFloat(formData.quantity),
        availableQuantity: formData.availableQuantity
          ? parseFloat(formData.availableQuantity)
          : parseFloat(formData.quantity),
        location: formData.location.trim(),
        organic: formData.organic,
        images: formData.images
      };

      await productService.createProduct(payload);
      showToast('Crop listing published to marketplace!', 'success');
      navigate('/farmer/products');
    } catch (err) {
      setError(err.message || 'Failed to publish crop listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = CATEGORIES.filter((c) => c !== 'All').map((c) => ({ label: c, value: c }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Sidebar role="farmer" />

        <main className="flex-1 w-full space-y-6">
          <div>
            <Link
              to="/farmer/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth-500 hover:text-forest-600 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to My Produce</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-earth-950 dark:text-white tracking-tight">
              List New Crop Harvest
            </h1>
            <p className="text-xs sm:text-sm text-earth-500">
              Publish authentic farm produce directly to consumers with custom pricing
            </p>
          </div>

          <Card className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <Input
                label="Produce / Crop Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Farm Fresh Organic Red Tomatoes"
                required
              />

              {/* Category & Organic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <Select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  options={categoryOptions}
                  required
                />

                <div className="pt-5">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-earth-300 dark:border-earth-700 bg-earth-50 dark:bg-earth-900 cursor-pointer">
                    <input
                      type="checkbox"
                      name="organic"
                      checked={formData.organic}
                      onChange={handleChange}
                      className="w-4 h-4 text-forest-600 rounded focus:ring-forest-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-earth-900 dark:text-white flex items-center gap-1">
                        <Sprout className="w-3.5 h-3.5 text-forest-600" />
                        Certified Organic Produce
                      </span>
                      <p className="text-earth-500">Pesticide and synthetic chemical free</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Price, Unit & Quantities */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Price per Unit (₹)"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 38"
                  required
                />

                <Select
                  label="Unit of Measurement"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  options={UNITS}
                  required
                />

                <Input
                  label="Harvest Stock Quantity"
                  name="quantity"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  required
                />
              </div>

              {/* Location */}
              <Input
                label="Farm Harvest Location / Region"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Nashik, Maharashtra"
                required
              />

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 dark:text-earth-300 mb-1.5">
                  Produce Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your crop quality, taste, harvest method, shelf life, and packaging..."
                  className="w-full text-sm rounded-xl border border-earth-300 dark:border-earth-700 bg-white dark:bg-earth-900 p-3 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                  required
                />
              </div>

              {/* Images */}
              <ImageUpload
                images={formData.images}
                onChange={handleImagesChange}
                maxImages={4}
              />

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 font-medium">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-earth-100 dark:border-earth-800">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/farmer/products')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={Save}
                  isLoading={isSubmitting}
                >
                  Publish Crop
                </Button>
              </div>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AddProduct;
