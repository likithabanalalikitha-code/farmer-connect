import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`
          ${sizeClasses[size] || sizeClasses.md}
          border-forest-200 dark:border-forest-900
          border-t-forest-600 dark:border-t-forest-400
          rounded-full animate-spin
          ${className}
        `}
      />
    </div>
  );
};

export default Spinner;
