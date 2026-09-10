import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sprout } from 'lucide-react';
import { productService } from '../services/productService';
import { CATEGORIES, UNITS } from '../utils/constants';
import { showToast } from '../components/common/Toast';
import Sidebar from '../components/layout/Sidebar';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import ImageUpload from '../components/common/ImageUpload';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import ErrorState from '../components/common/ErrorState';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    quantity: '',
    availableQuantity: '',
    location: '',
    organic: false,
    images: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await productService.getProductById(id);
        const p = res.data.product;
        setFormData({
          name: p.name || '',
          description: p.description || '',
          category: p.category || 'Vegetables',
          price: p.price || '',
          unit: p.unit || 'kg',
          quantity: p.quantity || '',
          availableQuantity: p.availableQuantity || '',
          location: p.location || '',
          organic: !!p.organic,
          images: p.images || []
        });
      } catch (err) {
        setError(err.message || 'Could not load product for editing.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price in ₹ is required.');
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
        availableQuantity: parseFloat(formData.availableQuantity),
        location: formData.location.trim(),
        organic: formData.organic,
        images: formData.images
      };

      await productService.updateProduct(id, payload);
      showToast('Crop listing updated successfully!', 'success');
      navigate('/farmer/products');
    } catch (err) {
      setError(err.message || 'Failed to update product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = CATEGORIES.filter((c) => c !== 'All').map((c) => ({ label: c, value: c }));

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
              Edit Crop Listing
            </h1>
            <p className="text-xs sm:text-sm text-earth-500">
              Update pricing in ₹, modify available stock, or refresh harvest details
            </p>
          </div>

          <Card className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Produce Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

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
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Price per Unit (₹)"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />

                <Select
                  label="Measurement Unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  options={UNITS}
                  required
                />

                <Input
                  label="Available Quantity"
                  name="availableQuantity"
                  type="number"
                  step="0.1"
                  value={formData.availableQuantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                label="Harvest Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 dark:text-earth-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full text-sm rounded-xl border border-earth-300 dark:border-earth-700 bg-white dark:bg-earth-900 p-3 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                  required
                />
              </div>

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
                  Save Updates
                </Button>
              </div>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default EditProduct;
