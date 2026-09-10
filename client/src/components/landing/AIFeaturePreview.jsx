import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import Button from '../common/Button';

const demoQA = [
  {
    q: 'Find organic vegetables',
    a: 'Here are certified organic options in the marketplace right now:\n• **Farm Fresh Organic Red Tomatoes** at ₹38/kg (420kg available from Ramesh Patel in Nashik)\n• **Organic Red Onions** at ₹28/kg\nBoth are pesticide-free and available for direct delivery with Cash on Delivery.'
  },
  {
    q: 'I need 20kg rice',
    a: 'We have **Premium Aged Basmati Rice (1121 XXL Grain)** from Gurpreet Singh in Ludhiana at ₹145/kg (1850kg in stock). For a 20kg order, the total is ₹2,900 with direct farm packaging.'
  },
  {
    q: 'How do I track my order?',
    a: 'Navigate to **My Orders** in the top navigation bar. Every order includes an animated live progress tracker showing: Order Placed → Confirmed → Harvesting/Packed → In Transit → Delivered.'
  },
  {
    q: 'How can I sell my farm products?',
    a: 'Register a free account with the role set to **Farmer**, go to your **Farmer Dashboard**, and click "Add Product". You can upload photos, specify harvest quantities, set your price in ₹, and receive orders directly!'
  }
];

const AIFeaturePreview = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const { openAssistant } = useAI();

  return (
    <section className="py-20 bg-forest-950 text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-forest-700/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800/80 border border-forest-700 text-forest-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by Groq & LLaMA 3.1 8B</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Your Intelligent Agricultural Marketplace Assistant
            </h2>

            <p className="text-sm sm:text-base text-forest-200/80 leading-relaxed">
              Experience conversational commerce. Ask natural questions about crop availability, bulk quantities, seasonal harvests, or farm logistics, and receive grounded answers based on live catalog data.
            </p>

            {/* Interactive Query Pills */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-forest-400">
                Try asking our assistant:
              </p>
              <div className="flex flex-wrap gap-2">
                {demoQA.map((item, idx) => (
                  <button
                    key={item.q}
                    onClick={() => setSelectedIdx(idx)}
                    className={`text-xs px-3.5 py-2 rounded-xl border transition-all text-left ${
                      selectedIdx === idx
                        ? 'bg-forest-600 border-forest-400 text-white font-semibold shadow-glow-green'
                        : 'bg-forest-900/60 border-forest-800 text-forest-200 hover:border-forest-600'
                    }`}
                  >
                    "{item.q}"
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={openAssistant}
                icon={Bot}
                className="bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold"
              >
                Launch AI Assistant Now
              </Button>
            </div>
          </div>

          {/* Right Simulated Interactive Chat Box */}
          <div className="lg:col-span-6">
            <div className="bg-earth-900/90 rounded-3xl border border-forest-800/80 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-earth-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-600 flex items-center justify-center text-white">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Farmer Market Assistant</h3>
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Online • Groq llama-3.1-8b-instant
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 min-h-[220px]">
                {/* User Bubble */}
                <div className="flex justify-end">
                  <div className="bg-forest-600 text-white text-xs sm:text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%]">
                    {demoQA[selectedIdx].q}
                  </div>
                </div>

                {/* Assistant Bubble */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-forest-700 text-forest-200 flex items-center justify-center shrink-0 text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedIdx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-earth-800 text-earth-100 text-xs sm:text-sm p-4 rounded-2xl rounded-tl-sm border border-earth-700/60 max-w-[90%] whitespace-pre-line leading-relaxed"
                    >
                      {demoQA[selectedIdx].a}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Simulated Input Bar */}
              <div className="mt-4 pt-3 border-t border-earth-800 flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="Ask about crop prices, recipes, or direct farm delivery..."
                  className="flex-1 bg-earth-950/60 border border-earth-800 rounded-xl px-3.5 py-2 text-xs text-earth-400 focus:outline-none cursor-pointer"
                  onClick={openAssistant}
                />
                <button
                  onClick={openAssistant}
                  className="p-2 rounded-xl bg-forest-600 text-white hover:bg-forest-500 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeaturePreview;
