import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, User, Sprout, ArrowUpRight } from 'lucide-react';
import { formatShortDate } from '../../utils/formatters';

const AIMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;

  // Format content with bold and line breaks safely
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      // Check for bullet
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const cleanLine = isBullet ? line.replace(/^[•-]\s*/, '') : line;

      // Handle **bold** substrings
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-earth-950 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={lIdx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-forest-600 dark:text-forest-400 font-bold">•</span>
            <span>{formattedParts}</span>
          </div>
        );
      }

      return (
        <p key={lIdx} className={line.trim() === '' ? 'h-2' : 'my-0.5'}>
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-forest-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[85%] space-y-2`}>
        <div
          className={`
            p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed
            ${
              isUser
                ? 'bg-forest-600 text-white rounded-tr-sm shadow-sm'
                : isError
                ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-tl-sm'
                : 'bg-white dark:bg-earth-800 text-earth-800 dark:text-earth-100 border border-earth-200 dark:border-earth-700/80 rounded-tl-sm shadow-sm'
            }
          `}
        >
          {renderFormattedText(message.content)}
        </div>

        {/* Attached real product recommendation cards if present */}
        {!isUser && message.products && message.products.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] font-bold text-earth-500 uppercase tracking-wider flex items-center gap-1">
              <Sprout className="w-3 h-3 text-forest-600" />
              Verified Marketplace Items
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.products.map((prod) => (
                <Link
                  key={prod.id}
                  to={`/products/${prod.id}`}
                  className="p-2.5 rounded-xl bg-forest-50/70 dark:bg-forest-950/40 border border-forest-200/60 dark:border-forest-800/60 hover:border-forest-400 transition-colors flex items-center justify-between group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-earth-900 dark:text-white truncate group-hover:text-forest-600">
                      {prod.name}
                    </p>
                    <p className="text-[11px] text-forest-700 dark:text-forest-400 font-semibold">
                      {prod.price}
                    </p>
                    <p className="text-[10px] text-earth-500 truncate">
                      {prod.location}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-forest-600 shrink-0 opacity-70 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-earth-200 dark:bg-earth-800 text-earth-700 dark:text-earth-300 flex items-center justify-center shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default AIMessage;
