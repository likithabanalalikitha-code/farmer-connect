import React from 'react';
import { Star, Quote } from 'lucide-react';
import Card from '../common/Card';

const testimonials = [
  {
    name: 'Ramesh Patel',
    role: 'Organic Vegetable Farmer (Nashik)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    quote: 'Selling directly on Farmer Market Connect changed our livelihoods. We no longer wait on middlemen commissions; our produce reaches kitchens across Mumbai within 24 hours of harvest.',
    rating: 5,
    tag: 'Demo Farmer Review'
  },
  {
    name: 'Priya Sharma',
    role: 'Consumer / Home Baker (Mumbai)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    quote: 'The aroma of the aged Basmati rice and fresh vine tomatoes is unmatched compared to supermarkets. Being able to ask the AI assistant for seasonal fruits makes shopping effortless.',
    rating: 5,
    tag: 'Demo Buyer Review'
  },
  {
    name: 'Anand Kulkarni',
    role: 'Organic Grocery Store Owner (Pune)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    quote: 'We source quintals of cold-pressed turmeric and Sharbati wheat directly from farmers. Complete transparency on origin, harvest dates, and honest pricing.',
    rating: 5,
    tag: 'Demo Retail Review'
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-earth-50 dark:bg-earth-900/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-600 dark:text-forest-400">
            Community Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-earth-900 dark:text-white tracking-tight">
            Trusted by Farmers and Consumers
          </h2>
          <p className="text-sm sm:text-base text-earth-600 dark:text-earth-400">
            Hear illustrative perspectives from agricultural growers and everyday buyers on the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <Card key={item.name} className="p-6 flex flex-col justify-between relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-harvest-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-harvest-400 text-harvest-400" />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-earth-400 bg-earth-100 dark:bg-earth-800 px-2 py-0.5 rounded-md">
                    {item.tag}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-earth-700 dark:text-earth-300 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-earth-100 dark:border-earth-800">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-earth-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-xs text-earth-500 dark:text-earth-400">
                    {item.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
