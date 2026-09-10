import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import Button from './Button';

const ImageUpload = ({ images = [], onChange, maxImages = 4, label = 'Product Images' }) => {
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setError('');

    if (images.length + files.length > maxImages) {
      setError(`You can upload a maximum of ${maxImages} images.`);
      return;
    }

    files.forEach((file) => {
      // Validate type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPG, PNG, and WebP images are allowed.');
        return;
      }
      // Validate size (< 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onChange([...images, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput || !urlInput.trim()) return;

    if (images.length >= maxImages) {
      setError(`You can add a maximum of ${maxImages} images.`);
      return;
    }

    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleRemove = (indexToRemove) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-earth-700 dark:text-earth-300">
          {label} ({images.length}/{maxImages})
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs font-medium text-forest-600 hover:text-forest-700 dark:text-forest-400 flex items-center gap-1"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          {showUrlInput ? 'Hide URL input' : 'Add by image URL'}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image URL (https://...)"
            className="flex-1 text-sm rounded-xl border border-earth-300 dark:border-earth-700 bg-white dark:bg-earth-900 px-3.5 py-2 text-earth-900 dark:text-earth-100 focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
          <Button type="button" onClick={handleAddUrl} size="sm">
            Add
          </Button>
        </div>
      )}

      {/* Grid of existing images */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-2xl overflow-hidden border border-earth-200 dark:border-earth-800 group bg-earth-100 dark:bg-earth-800"
          >
            <img
              src={img}
              alt={`Upload ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors opacity-90 group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Upload box if under max */}
        {images.length < maxImages && (
          <label className="aspect-square flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-earth-300 dark:border-earth-700 hover:border-forest-500 dark:hover:border-forest-400 bg-white/50 dark:bg-earth-900/50 hover:bg-forest-50/30 cursor-pointer transition-all">
            <Upload className="w-6 h-6 text-earth-400 mb-1" />
            <span className="text-xs font-medium text-earth-600 dark:text-earth-400 text-center px-2">
              Upload Photo
            </span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      <p className="text-[11px] text-earth-400">
        Supports JPG, PNG, WebP up to 5MB. Cloud-ready architecture.
      </p>
    </div>
  );
};

export default ImageUpload;
