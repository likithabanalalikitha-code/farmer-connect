import React from 'react';

const Card = ({
  children,
  className = '',
  hoverable = false,
  glass = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl transition-all duration-300
        ${
          glass
            ? 'glass-panel border border-white/40 dark:border-earth-800/60 shadow-sm'
            : 'bg-white dark:bg-earth-900 border border-earth-200/80 dark:border-earth-800/80 shadow-subtle'
        }
        ${
          hoverable
            ? 'hover:-translate-y-1 hover:shadow-elevated hover:border-forest-300 dark:hover:border-forest-800 cursor-pointer'
            : ''
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
