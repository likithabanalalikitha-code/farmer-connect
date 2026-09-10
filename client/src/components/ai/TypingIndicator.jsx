import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-earth-800 border border-earth-200 dark:border-earth-700 shadow-sm w-fit">
      <span className="w-2 h-2 rounded-full bg-forest-600 dark:bg-forest-400 animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 rounded-full bg-forest-600 dark:bg-forest-400 animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 rounded-full bg-forest-600 dark:bg-forest-400 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
};

export default TypingIndicator;
