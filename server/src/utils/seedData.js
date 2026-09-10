const mongoose = require('mongoose');
const config = require('../config/env');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

const categoriesData = [
  { name: 'Vegetables', slug: 'vegetables', description: 'Fresh farm harvested vegetables', icon: 'Carrot', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80' },
  { name: 'Fruits', slug: 'fruits', description: 'Orchard-picked fresh and seasonal fruits', icon: 'Apple', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80' },
  { name: 'Grains', slug: 'grains', description: 'Staple grains, wheat, premium rice, and millets', icon: 'Wheat', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80' },
  { name: 'Pulses', slug: 'pulses', description: 'High-protein lentils, dal, and legumes', icon: 'Bean', image: 'https://images.unsplash.com/photo-1585994192701-77e828a6b28d?w=600&auto=format&fit=crop&q=80' },
  { name: 'Spices', slug: 'spices', description: 'Aromatic whole spices, turmeric, and herbs', icon: 'Flame', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80' },
  { name: 'Dairy', slug: 'dairy', description: 'Fresh farm milk, desi ghee, and curd', icon: 'Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80' },
  { name: 'Organic Products', slug: 'organic-products', description: 'Certified chemical-free natural produce', icon: 'Leaf', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600&auto=format&fit=crop&q=80' },
  { name: 'Seeds & Saplings', slug: 'seeds', description: 'Non-GMO heirloom seeds and nursery plants', icon: 'Sprout', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&auto=format&fit=crop&q=80' }
];

const farmersData = [
  {
    name: 'Ramesh Patel',
    email: 'ramesh.farmer@example.com',
    password: 'Password123!',
    role: 'farmer',
    phone: '+91 98234 11223',
    farmName: 'Green Fields Organic Farm',
    farmDescription: 'Cultivating pesticide-free vegetables and seasonal crops using regenerative soil techniques since 2012.',
    city: 'Nashik',
    state: 'Maharashtra',
    address: 'Survey No. 44, Dindori Road',
    pincode: '422004',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Gurpreet Singh',
    email: 'gurpreet.farmer@example.com',
    password: 'Password123!',
    role: 'farmer',
    phone: '+91 97123 44556',
    farmName: 'Punjab Golden Harvest',
    farmDescription: 'Specializing in premium long-grain aromatic Basmati rice, Sharbati wheat, and organic pulses.',
    city: 'Ludhiana',
    state: 'Punjab',
    address: 'VPO Khanna, GT Road',
    pincode: '141401',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Sunita Rao',
    email: 'sunita.farmer@example.com',
    password: 'Password123!',
    role: 'farmer',
    phone: '+91 96321 77889',
    farmName: 'Deccan Agro Orchards',
    farmDescription: 'Natural orchards producing naturally ripened mangoes, bananas, chillies, and sun-dried spices.',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    address: 'Plot 12, Tenali Agro Corridor',
    pincode: '522201',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
  }
];

const consumersData = [
  {
    name: 'Priya Sharma',
    email: 'priya.buyer@example.com',
    password: 'Password123!',
    role: 'consumer',
    phone: '+91 91234 56780',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'B-402, Lotus Greens, Andheri West',
    pincode: '400053',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.buyer@example.com',
    password: 'Password123!',
    role: 'consumer',
    phone: '+91 98877 66554',
    city: 'Bangalore',
    state: 'Karnataka',
    address: '14, 5th Main, Indiranagar',
    pincode: '560038',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
  }
];

const seedData = async () => {
  try {
    console.log('🌾 Connecting to MongoDB for Data Seeding...');
    await mongoose.connect(config.mongoUri);

    console.log('🧹 Cleaning existing test products, categories, demo users, and orders...');
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      User.deleteMany({ email: { $ne: config.adminEmail } }),
      Order.deleteMany({})
    ]);

    // 1. Seed Categories
    console.log('🌱 Seeding Categories...');
    const createdCategories = await Category.insertMany(categoriesData);

    // 2. Seed Farmers & Consumers
    console.log('👩‍🌾 Seeding Demo Farmers & Consumers...');
    const createdFarmers = [];
    for (const f of farmersData) {
      const user = await User.create(f);
      createdFarmers.push(user);
    }

    const createdConsumers = [];
    for (const c of consumersData) {
      const user = await User.create(c);
      createdConsumers.push(user);
    }

    // 3. Seed Products
    console.log('🍅 Seeding Realistic Farm Products...');
    const productsData = [
      {
        name: 'Farm Fresh Organic Red Tomatoes',
        description: 'Vine-ripened, juicy red tomatoes harvested daily morning without chemical insecticides. Rich in lycopene and perfect for fresh salads, curries, and sauces.',
        category: 'Vegetables',
        farmer: createdFarmers[0]._id,
        price: 38,
        unit: 'kg',
        quantity: 500,
        availableQuantity: 420,
        organic: true,
        location: 'Nashik, Maharashtra',
        images: [
          'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'
        ]
      },
      {
        name: 'Organic Red Onions (Medium-Large)',
        description: 'Pungent, flavorful farm-cured red onions from Maharashtra rich soil. Excellent keeping quality and sweetness when caramelized.',
        category: 'Vegetables',
        farmer: createdFarmers[0]._id,
        price: 28,
        unit: 'kg',
        quantity: 1200,
        availableQuantity: 1100,
        organic: true,
        location: 'Nashik, Maharashtra',
        images: [
          'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80'
        ]
      },
      {
        name: 'Fresh Hill Potatoes (Pahar Ke Aloo)',
        description: 'Nutrient-rich, thin-skinned hill potatoes with natural earthy flavor. Less starchy and superb for roasting, boiling, and curries.',
        category: 'Vegetables',
        farmer: createdFarmers[0]._id,
        price: 32,
        unit: 'kg',
        quantity: 800,
        availableQuantity: 750,
        organic: false,
        location: 'Nashik, Maharashtra',
        images: [
          'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80'
        ]
      },
      {
        name: 'Premium Aged Basmati Rice (1121 XXL Grain)',
        description: 'Naturally aged for 2 years. Features extra-long slender grains that elongate up to 2.5 times with an unforgettable floral aroma.',
        category: 'Grains',
        farmer: createdFarmers[1]._id,
        price: 145,
        unit: 'kg',
        quantity: 2000,
        availableQuantity: 1850,
        organic: false,
        location: 'Ludhiana, Punjab',
        images: [
          'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
        ]
      },
      {
        name: 'Sharbati Whole Wheat Grain (Desi Gehun)',
        description: 'Sun-drenched, golden Sharbati wheat grains known for natural sweetness and high protein content. Makes soft, fluffy chapatis.',
        category: 'Grains',
        farmer: createdFarmers[1]._id,
        price: 48,
        unit: 'kg',
        quantity: 3000,
        availableQuantity: 2800,
        organic: true,
        location: 'Ludhiana, Punjab',
        images: [
          'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80'
        ]
      },
      {
        name: 'Unpolished Yellow Moong Dal',
        description: 'Traditional stone-milled unpolished yellow split gram. Retains all natural dietary fiber, vitamins, and fast cooking properties.',
        category: 'Pulses',
        farmer: createdFarmers[1]._id,
        price: 120,
        unit: 'kg',
        quantity: 600,
        availableQuantity: 580,
        organic: true,
        location: 'Ludhiana, Punjab',
        images: [
          'https://images.unsplash.com/photo-1585994192701-77e828a6b28d?w=800&auto=format&fit=crop&q=80'
        ]
      },
      {
        name: 'Original Ratnagiri Alphonso Mangoes (Hapus)',
        description: 'GI-tagged authentic Ratnagiri Alphonso mangoes. Tree-ripened in grass boxes, rich saffron flesh with heavenly natural aroma.',
        category: 'Fruits',
        farmer: createdFarmers[2]._id,
        price: 750,
        unit: 'dozen',
        quantity: 150,
        availableQuantity: 110,
        organic: true,
        location: 'Guntur, Andhra Pradesh',
        images: [
          'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80'
        ]
      },
      {
        name: 'Naturally Ripened Robusta Bananas',
        description: 'Sweet, energy-dense bananas harvested fresh from coastal orchards. Never artificially ripened with carbide gas.',
        category: 'Fruits',
        farmer: createdFarmers[2]._id,
        price: 45,
        unit: 'dozen',
        quantity: 300,
        availableQuantity: 260,
        organic: true,
        location: 'Guntur, Andhra Pradesh',
        images: [
          'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80'
        ]
      },
      {
        name: 'Organic Lakadong High-Curcumin Turmeric Powder',
        description: 'Celebrated Lakadong turmeric with an extraordinary 7.5% natural curcumin percentage. Cold-milled on farm premises.',
        category: 'Spices',
        farmer: createdFarmers[2]._id,
        price: 240,
        unit: 'kg',
        quantity: 400,
        availableQuantity: 380,
        organic: true,
        location: 'Guntur, Andhra Pradesh',
        images: [
          'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'
        ]
      },
      {
        name: 'Guntur Hot Red Dry Chillies (S4 Sanam)',
        description: 'Sun-dried vibrant red chillies with balanced fiery heat and rich natural red color for authentic Indian spice blends.',
        category: 'Spices',
        farmer: createdFarmers[2]._id,
        price: 190,
        unit: 'kg',
        quantity: 500,
        availableQuantity: 470,
        organic: false,
        location: 'Guntur, Andhra Pradesh',
        images: [
          'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80'
        ]
      },
      {
        name: 'Pure Desi A2 Cow Ghee (Bilona Method)',
        description: 'Traditional hand-churned cultured ghee made from grass-fed Gir cow milk. Golden granules and authentic Vedic aroma.',
        category: 'Dairy',
        farmer: createdFarmers[0]._id,
        price: 850,
        unit: 'liter',
        quantity: 80,
        availableQuantity: 65,
        organic: true,
        location: 'Nashik, Maharashtra',
        images: [
          'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&auto=format&fit=crop&q=80'
        ]
      },
      {
        name: 'Heirloom Country Tomato Seeds',
        description: 'Open-pollinated, non-hybrid traditional desi tomato seeds with high germination rate (90%+) and natural disease resistance.',
        category: 'Seeds & Saplings',
        farmer: createdFarmers[0]._id,
        price: 99,
        unit: 'box',
        quantity: 200,
        availableQuantity: 190,
        organic: true,
        location: 'Nashik, Maharashtra',
        images: [
          'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80'
        ]
      }
    ];

    const createdProducts = await Product.insertMany(productsData);

    // 4. Seed Orders
    console.log('📦 Seeding Demo Orders with Timelines...');
    await Order.create({
      buyer: createdConsumers[0]._id,
      items: [
        {
          product: createdProducts[0]._id,
          farmer: createdFarmers[0]._id,
          name: createdProducts[0].name,
          quantity: 5,
          unit: createdProducts[0].unit,
          price: createdProducts[0].price,
          subtotal: 190,
          image: createdProducts[0].images[0]
        },
        {
          product: createdProducts[3]._id,
          farmer: createdFarmers[1]._id,
          name: createdProducts[3].name,
          quantity: 10,
          unit: createdProducts[3].unit,
          price: createdProducts[3].price,
          subtotal: 1450,
          image: createdProducts[3].images[0]
        }
      ],
      totalAmount: 1640,
      shippingAddress: {
        fullName: 'Priya Sharma',
        phone: '+91 91234 56780',
        address: 'B-402, Lotus Greens, Andheri West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400053'
      },
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'pending',
      orderStatus: 'confirmed',
      timeline: [
        { status: 'pending', note: 'Order placed by Priya Sharma', timestamp: new Date(Date.now() - 86400000) },
        { status: 'confirmed', note: 'Confirmed by Farmer Ramesh Patel & Gurpreet Singh', timestamp: new Date(Date.now() - 43200000) }
      ]
    });

    console.log('✅ Demo Seed Data successfully created!');
    console.log(`🌾 Summary:
    - ${createdCategories.length} Categories
    - ${createdFarmers.length} Farmers
    - ${createdConsumers.length} Consumers
    - ${createdProducts.length} Agricultural Products
    - 1 Sample Multi-Item Order
    `);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Data seed error:', error.message);
    process.exit(1);
  }
};

seedData();
