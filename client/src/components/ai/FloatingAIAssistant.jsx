import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  Trash2,
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronDown
} from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import AIMessage from './AIMessage';
import TypingIndicator from './TypingIndicator';

const FloatingAIAssistant = () => {
  const {
    isOpen,
    toggleAssistant,
    closeAssistant,
    messages,
    sendMessage,
    isLoading,
    clearConversation,
    suggestedQueries
  } = useAI();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;

    sendMessage(inputPrompt.trim());
    setInputPrompt('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePillClick = (query) => {
    sendMessage(query);
  };

  return (
    <>
      {/* Floating Floating Launcher Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleAssistant}
          className="fixed bottom-6 right-6 z-40 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-forest-600 to-emerald-600 text-white shadow-2xl hover:shadow-glow-green flex items-center gap-2 group transition-all"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 border-2 border-forest-600 animate-pulse" />
          </div>
          <span className="text-xs font-bold hidden sm:inline tracking-wide">
            Market AI
          </span>
        </motion.button>
      )}

      {/* Floating Chat Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed z-50 rounded-3xl bg-white/95 dark:bg-earth-900/95 backdrop-blur-xl border border-earth-200 dark:border-earth-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-200
              ${
                isExpanded
                  ? 'inset-4 sm:inset-10'
                  : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[580px] max-h-[85vh]'
              }
            `}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-forest-700 to-emerald-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-forest-200 border border-white/15">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-none flex items-center gap-1.5">
                    Market Assistant
                    <span className="text-[10px] font-medium bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded">
                      LLaMA 3.1
                    </span>
                  </h3>
                  <p className="text-[11px] text-forest-200/80 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Groq Accelerated AI
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-white/80">
                <button
                  type="button"
                  onClick={clearConversation}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  title="Clear Chat History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors hidden sm:block"
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={closeAssistant}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  title="Close Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <AIMessage key={msg.id || idx} message={msg} />
              ))}

              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-forest-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <TypingIndicator />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Prompt Suggestion Pills */}
            <div className="px-4 py-2 border-t border-earth-100 dark:border-earth-800/80 bg-earth-50/50 dark:bg-earth-950/30 shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-earth-500 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-forest-600" />
                Quick Suggestions
              </p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {suggestedQueries.map((query) => (
                  <button
                    key={query}
                    type="button"
                    onClick={() => handlePillClick(query)}
                    className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-earth-800 border border-earth-200 dark:border-earth-700 text-earth-700 dark:text-earth-300 hover:border-forest-500 hover:text-forest-600 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-earth-900 border-t border-earth-200 dark:border-earth-800 shrink-0 flex items-center gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about crops, prices in ₹, or orders..."
                className="flex-1 text-xs sm:text-sm bg-earth-50 dark:bg-earth-800/60 border border-earth-200 dark:border-earth-700 rounded-2xl px-3.5 py-2.5 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none max-h-24"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className="p-3 rounded-2xl bg-forest-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-forest-700 shadow-sm hover:shadow-glow-green transition-all"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAIAssistant;
