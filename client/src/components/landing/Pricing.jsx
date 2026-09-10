import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Info } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const plans = [
  {
    name: 'Consumer / Buyer',
    price: '₹0',
    frequency: 'Free Forever',
    description: 'Perfect for households and families buying fresh produce directly from farms.',
    features: [
      'Browse all agricultural categories',
      'Direct contact with local growers',
      'Cash on Delivery ordering',
      'Real-time shipment tracking',
      'AI Assistant product recommendations'
    ],
    cta: 'Start Buying',
    to: '/register',
    popular: false
  },
  {
    name: 'Farmer Seller',
    price: '₹0',
    frequency: 'Zero Commission',
    description: 'Designed for independent growers, organic cultivators, and rural farmer cooperatives.',
    features: [
      'Unlimited produce listings',
      'Set your own prices in ₹ and units',
      'Keep 100% of your listed revenue',
      'Farmer Dashboard & sales metrics',
      'Manage inventory & order status',
      'Groq AI farm selling guidance'
    ],
    cta: 'Join as Farmer',
    to: '/register',
    popular: true
  },
  {
    name: 'Wholesale & Retailers',
    price: 'Custom',
    frequency: 'Future-Ready B2B',
    description: 'Bulk procurement for organic stores, restaurants, and regional retailers.',
    features: [
      'Bulk quintal/ton volume orders',
      'Consolidated logistics assistance',
      'Priority farmer supply booking',
      'Dedicated compliance reporting',
      'Custom invoice management'
    ],
    cta: 'Contact Support',
    to: '/marketplace',
    popular: false
  }
];

const Pricing = () => {
  return (
    <section className="py-20 bg-white dark:bg-earth-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-600 dark:text-forest-400">
            Transparent Platform Model
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-earth-900 dark:text-white tracking-tight">
            Fair Pricing for Everyone
          </h2>
          <p className="text-sm sm:text-base text-earth-600 dark:text-earth-400">
            Direct agricultural trade should be transparent and accessible without hidden transaction charges.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-8 flex flex-col justify-between relative ${
                plan.popular
                  ? 'border-2 border-forest-600 shadow-xl ring-4 ring-forest-500/10'
                  : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-forest-600 text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-bold text-earth-900 dark:text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-xs text-earth-500 dark:text-earth-400 mb-6 min-h-[36px]">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-earth-100 dark:border-earth-800">
                  <span className="text-4xl font-extrabold text-earth-950 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-xs font-semibold text-earth-500">
                    / {plan.frequency}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-xs text-earth-700 dark:text-earth-300">
                      <Check className="w-4 h-4 text-forest-600 dark:text-forest-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to={plan.to} className="w-full">
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="md"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* Informative Disclaimer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-earth-500 text-center">
          <Info className="w-4 h-4 text-forest-600 shrink-0" />
          <span>Core direct trade on Farmer Market Connect is 100% free with direct Cash on Delivery. Enterprise plans are illustrative for future B2B expansions.</span>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
