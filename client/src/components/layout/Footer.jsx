import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, HeartHandshake, Leaf, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-earth-100 dark:bg-earth-950 border-t border-earth-200 dark:border-earth-900 text-earth-700 dark:text-earth-400 text-sm transition-colors mt-20">
      {/* Top Value Highlights */}
      <div className="border-b border-earth-200 dark:border-earth-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-700 dark:text-forest-400 flex items-center justify-center shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-earth-900 dark:text-earth-100 text-base mb-1">
                Zero Middlemen Commission
              </h4>
              <p className="text-xs text-earth-500 dark:text-earth-400 leading-relaxed">
                Farmers receive 100% of their listed prices. Transparent Indian agricultural trade.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-700 dark:text-forest-400 flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-earth-900 dark:text-earth-100 text-base mb-1">
                Farm-Harvested Freshness
              </h4>
              <p className="text-xs text-earth-500 dark:text-earth-400 leading-relaxed">
                Produce packed directly at village farms and transported straight to your doorstep.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 dark:bg-forest-950 text-forest-700 dark:text-forest-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-earth-900 dark:text-earth-100 text-base mb-1">
                AI Guided Assistance
              </h4>
              <p className="text-xs text-earth-500 dark:text-earth-400 leading-relaxed">
                Instant smart recommendations powered by Groq LLaMA 3.1 8B for buyers and farmers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-forest-600 flex items-center justify-center text-white">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-earth-900 dark:text-white">
              Farmer Market <span className="text-forest-600 dark:text-forest-400">Connect</span>
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-earth-500 dark:text-earth-400">
            A production-ready agricultural marketplace empowering Indian farmers with digital accessibility, direct market sales, and intelligent conversational assistance.
          </p>
          <div className="flex items-center gap-2 text-xs text-earth-500">
            <MapPin className="w-4 h-4 text-forest-600 shrink-0" />
            <span>Connecting India’s agricultural heartlands</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-earth-900 dark:text-earth-100 mb-4">
            Marketplace
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/marketplace" className="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                All Produce
              </Link>
            </li>
            <li>
              <Link to="/marketplace?category=Vegetables" className="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                Farm Vegetables
              </Link>
            </li>
            <li>
              <Link to="/marketplace?category=Fruits" className="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                Seasonal Orchards
              </Link>
            </li>
            <li>
              <Link to="/marketplace?category=Grains" className="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                Rice & Wheat Grains
              </Link>
            </li>
            <li>
              <Link to="/marketplace?organic=true" className="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                Certified Organic
              </Link>
            </li>
          </ul>
        </div>

        {/* For Producers */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-earth-900 dark:text-earth-100 mb-4">
            For Farmers
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/register" className="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                Join as a Farmer
              </Link>
            </li>
            <li>
              <Link to="/farmer/dashboard" className="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                Farmer Dashboard
              </Link>
            </li>
            <li>
              <Link to="/farmer/products/add" className="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                List Harvest
              </Link>
            </li>
            <li>
              <Link to="/farmer/orders" className="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                Incoming Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Platform & Support */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-earth-900 dark:text-earth-100 mb-4">
            Platform
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <span className="text-earth-600 dark:text-earth-400">Payment: Cash on Delivery (COD)</span>
            </li>
            <li>
              <span className="text-earth-600 dark:text-earth-400">Currency: Indian Rupee (₹)</span>
            </li>
            <li>
              <span className="text-earth-600 dark:text-earth-400">AI Model: Groq LLaMA 3.1 8B</span>
            </li>
            <li className="pt-2 text-forest-600 dark:text-forest-400 font-medium">
              Direct Farmer Support Hotline:
            </li>
            <li className="flex items-center gap-1.5 text-xs text-earth-600 dark:text-earth-300">
              <Phone className="w-3.5 h-3.5 text-forest-600" />
              <span>+91 1800-FARM-CONNECT</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-earth-200 dark:border-earth-900 py-6 text-center text-xs text-earth-500">
        <p>© {new Date().getFullYear()} Farmer Market Connect. Built for Indian Agricultural Empowerment. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
