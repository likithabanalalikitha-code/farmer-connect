import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Leaf,
  Search,
  Bot,
  ShieldCheck,
  Truck,
  Sparkles
} from 'lucide-react';
import Card from '../common/Card';

const features = [
  {
    icon: Users,
    title: 'Direct Farmer-to-Buyer',
    description: 'Bypass long supply chain layers and middlemen. Connect directly with authentic regional agricultural growers.',
    color: 'forest'
  },
  {
    icon: Leaf,
    title: 'Farm-Fresh Harvest',
    description: 'Discover pesticide-free vegetables, seasonal orchard fruits, aged grains, and traditional cold-pressed spices.',
    color: 'green'
  },
  {
    icon: Search,
    title: 'Smart Marketplace',
    description: 'Search by crop, filter by organic certification, location, or price, and compare produce availability in real-time.',
    color: 'harvest'
  },
  {
    icon: Bot,
    title: 'Groq AI Assistant',
    description: 'Conversational assistant powered by LLaMA 3.1 to answer questions, find budget crops, and assist agricultural producers.',
    color: 'blue'
  },
  {
    icon: ShieldCheck,
    title: 'Transparent Transactions',
    description: 'Secure authentication, verified farm origins, zero surprise cuts, and convenient Cash on Delivery checkout.',
    color: 'purple'
  },
  {
    icon: Truck,
    title: 'Real-Time Order Tracking',
    description: 'Follow every stage of your harvest journey from farmer confirmation to packing, transit, and safe delivery.',
    color: 'forest'
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-earth-100/50 dark:bg-earth-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 dark:bg-forest-950 text-forest-700 dark:text-forest-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-earth-900 dark:text-white tracking-tight">
            Engineered for Fairer, Smarter Agriculture
          </h2>
          <p className="text-sm sm:text-base text-earth-600 dark:text-earth-400">
            Everything farmers and consumers need for direct trade, transparent prices, and seamless crop logistics.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card hoverable className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-forest-50 dark:bg-forest-950 text-forest-600 dark:text-forest-400 flex items-center justify-center mb-5 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-earth-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-earth-600 dark:text-earth-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
