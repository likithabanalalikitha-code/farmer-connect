import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Sprout, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';
import Button from '../common/Button';

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Subtle Background Glow Circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-forest-400/10 dark:bg-forest-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-harvest-400/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100/80 dark:bg-forest-950/60 border border-forest-200 dark:border-forest-800 text-forest-800 dark:text-forest-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
              <span>AI-Powered Direct Agricultural Marketplace</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-earth-950 dark:text-white leading-[1.15]">
              Connecting Farmers{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 via-emerald-600 to-forest-500 dark:from-forest-400 dark:to-emerald-400">
                Directly With
              </span>{' '}
              Markets.
            </h1>

            {/* Sub-text */}
            <p className="text-base sm:text-lg text-earth-600 dark:text-earth-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover fresh farm produce straight from rural producers, bypass intermediary markups, and purchase authentic harvest at fair prices—powered by intelligent AI assistance.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link to="/marketplace" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                  Explore Marketplace
                </Button>
              </Link>
              <Link to="/register" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Join as a Farmer
                </Button>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-earth-200 dark:border-earth-800 text-left">
              <div>
                <p className="text-2xl font-extrabold text-forest-700 dark:text-forest-400">0%</p>
                <p className="text-xs text-earth-500 dark:text-earth-400 font-medium">Middleman Fees</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-forest-700 dark:text-forest-400">100%</p>
                <p className="text-xs text-earth-500 dark:text-earth-400 font-medium">Farmer Revenue</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-forest-700 dark:text-forest-400">24/7</p>
                <p className="text-xs text-earth-500 dark:text-earth-400 font-medium">Groq AI Advice</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Card Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Visual Frame */}
            <div className="relative mx-auto max-w-md bg-white dark:bg-earth-900 rounded-3xl p-4 shadow-2xl border border-earth-200/80 dark:border-earth-800/80">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                  alt="Fresh farm produce"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-earth-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-forest-700 dark:text-forest-300 border border-white/50 flex items-center gap-1.5 shadow-sm">
                  <Sprout className="w-3.5 h-3.5 text-forest-600" />
                  <span>Farm Direct</span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-earth-900 dark:text-white text-base">
                      Fresh Farm Harvest Basket
                    </h3>
                    <p className="text-xs text-earth-500">Green Fields Organic • Nashik</p>
                  </div>
                  <span className="text-lg font-extrabold text-forest-600 dark:text-forest-400">
                    ₹38 / kg
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs text-earth-600 dark:text-earth-400">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> In Stock & Fresh
                  </span>
                  <span>•</span>
                  <span>Cash on Delivery</span>
                </div>
              </div>

              {/* Floating Mini Card 1: AI Prompt */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-5 -right-4 sm:-right-8 bg-white dark:bg-earth-800 p-3 rounded-2xl shadow-xl border border-earth-100 dark:border-earth-700 flex items-center gap-3 max-w-[240px]"
              >
                <div className="w-8 h-8 rounded-xl bg-forest-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-earth-900 dark:text-white">AI Assistant</p>
                  <p className="text-[10px] text-earth-500 truncate">“Found 120kg fresh organic tomatoes near you”</p>
                </div>
              </motion.div>

              {/* Floating Mini Card 2: Sales Boost */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute -bottom-6 -left-4 sm:-left-6 bg-white dark:bg-earth-800 p-3 rounded-2xl shadow-xl border border-earth-100 dark:border-earth-700 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-harvest-500 text-white flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-earth-900 dark:text-white">+38% Farmer Earnings</p>
                  <p className="text-[10px] text-earth-500">By eliminating local middle tier</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
