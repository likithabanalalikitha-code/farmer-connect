import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, ShoppingBag, Truck } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Register Profile',
    description: 'Sign up in seconds as a consumer looking for produce or as a farmer ready to list crops.',
    icon: UserPlus
  },
  {
    step: '02',
    title: 'Discover Produce',
    description: 'Browse verified harvests, compare unit rates in ₹, check organic tags, and read farmer stories.',
    icon: Search
  },
  {
    step: '03',
    title: 'Order Direct',
    description: 'Add fresh items directly to your cart and place orders with flexible Cash on Delivery.',
    icon: ShoppingBag
  },
  {
    step: '04',
    title: 'Farm-to-Door Delivery',
    description: 'Track your package progress through live status updates until fresh produce reaches you.',
    icon: Truck
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white dark:bg-earth-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-600 dark:text-forest-400">
            Simple Four-Step Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-earth-900 dark:text-white tracking-tight">
            How Farmer Market Connect Works
          </h2>
          <p className="text-sm sm:text-base text-earth-600 dark:text-earth-400">
            A frictionless platform built for direct trade between local farms and modern households.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className="relative p-6 rounded-3xl bg-earth-50 dark:bg-earth-900/60 border border-earth-200/80 dark:border-earth-800/80"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-forest-600/30 dark:text-forest-400/20">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-700 dark:text-forest-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-earth-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-earth-600 dark:text-earth-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
