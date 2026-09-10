import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const CategoryModal = ({ isOpen, onClose, category = null, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    icon: 'Sprout'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || '',
        icon: category.icon || 'Sprout'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        image: '',
        icon: 'Sprout'
      });
    }
    setError('');
  }, [category, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData, category?._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Create New Category'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Category Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Vegetables, Spices, Dairy"
          required
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 dark:text-earth-300 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Briefly describe produce in this category..."
            className="w-full text-sm rounded-xl border border-earth-300 dark:border-earth-700 bg-white dark:bg-earth-900 p-3 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
        </div>

        <Input
          label="Cover Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://images.unsplash.com/..."
          helperText="High resolution photo representing this produce category"
        />

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            {category ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryModal;
