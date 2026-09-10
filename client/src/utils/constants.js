export const CATEGORIES = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains',
  'Pulses',
  'Spices',
  'Dairy',
  'Organic Products',
  'Seeds & Saplings'
];

export const UNITS = [
  { label: 'Kilogram (kg)', value: 'kg' },
  { label: 'Quintal (100 kg)', value: 'quintal' },
  { label: 'Ton (1000 kg)', value: 'ton' },
  { label: 'Liter (L)', value: 'liter' },
  { label: 'Dozen (12 pcs)', value: 'dozen' },
  { label: 'Piece (pc)', value: 'piece' },
  { label: 'Box', value: 'box' },
  { label: 'Gram (g)', value: 'gram' },
  { label: 'Bunch', value: 'bunch' }
];

export const ORDER_STATUSES = [
  { key: 'pending', label: 'Order Placed', color: 'amber' },
  { key: 'confirmed', label: 'Confirmed', color: 'blue' },
  { key: 'processing', label: 'Harvesting / Packed', color: 'purple' },
  { key: 'shipped', label: 'In Transit', color: 'indigo' },
  { key: 'delivered', label: 'Delivered', color: 'green' },
  { key: 'cancelled', label: 'Cancelled', color: 'red' }
];

export const DEFAULT_PRODUCT_IMAGES = {
  Vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
  Fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80',
  Grains: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
  Pulses: 'https://images.unsplash.com/photo-1585994192701-77e828a6b28d?w=600&auto=format&fit=crop&q=80',
  Spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
  Dairy: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
  'Organic Products': 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80'
};
