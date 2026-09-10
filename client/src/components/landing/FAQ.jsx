import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'How does Farmer Market Connect work?',
    a: 'Farmer Market Connect provides a direct digital bridge between agricultural producers and consumers. Farmers register and list their available crops with real prices, units, and photos. Consumers can search, filter, and purchase produce without paying middleman markups.'
  },
  {
    q: 'Can farmers sell products directly?',
    a: 'Yes! Farmers have full control over their catalog. When you register as a farmer, you access the Farmer Dashboard to add harvests, set prices in Indian Rupees (₹), specify quantities in kilograms, quintals, or crates, and update availability status anytime.'
  },
  {
    q: 'How can I become a farmer seller?',
    a: 'Click "Join as Farmer" or "Register" and select the "Farmer" role. Fill in your name, email, phone number, and farm location. Once registered, your account is immediately active to post listings and receive orders.'
  },
  {
    q: 'How do I place an order?',
    a: 'Browse the Marketplace, select the products you need, adjust your desired quantities, and click "Add to Cart". Proceed to the Checkout page, fill in your delivery address, and confirm your order using Cash on Delivery (COD).'
  },
  {
    q: 'Can I track my order?',
    a: 'Absolutely. Every order features a real-time visual status timeline: Order Placed → Confirmed → Harvesting / Packed → In Transit → Delivered. You can view progress and tracking updates inside "My Orders".'
  },
  {
    q: 'What does the AI assistant do?',
    a: 'Our AI assistant is powered by Groq LLaMA 3.1 8B. It provides natural language guidance on finding seasonal produce, recommending recipes or bulk items, discovering organic options, answering order queries, and helping farmers manage their listings.'
  },
  {
    q: 'Is the platform free?',
    a: 'Yes! Joining Farmer Market Connect is 100% free for both consumers and farmers. There are no registration fees and zero broker commissions taken from farmer crop payouts.'
  },
  {
    q: 'How are products managed?',
    a: 'Farmers can manage their products directly from the "My Crops" section of their dashboard, updating stock levels, prices, or marking items as out of stock. Platform administrators also monitor listings to ensure quality and authentic agricultural representation.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-white dark:bg-earth-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-600 dark:text-forest-400">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-earth-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-earth-600 dark:text-earth-400">
            Everything you need to know about the marketplace, direct farmer trade, and AI assistance.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-earth-200 dark:border-earth-800 bg-earth-50/50 dark:bg-earth-900/40 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-earth-900 dark:text-white hover:text-forest-600 dark:hover:text-forest-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-earth-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-forest-600' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 text-xs sm:text-sm text-earth-600 dark:text-earth-300 leading-relaxed border-t border-earth-100 dark:border-earth-800/60 mt-1">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
