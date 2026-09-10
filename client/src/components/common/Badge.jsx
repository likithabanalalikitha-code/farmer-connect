import React from 'react';

const Badge = ({
  children,
  variant = 'forest',
  size = 'md',
  className = '',
  icon: Icon = null
}) => {
  const variants = {
    forest: 'bg-forest-100 text-forest-800 dark:bg-forest-950 dark:text-forest-300 border border-forest-200 dark:border-forest-800',
    harvest: 'bg-harvest-100 text-harvest-800 dark:bg-harvest-950 dark:text-harvest-300 border border-harvest-200 dark:border-harvest-800',
    earth: 'bg-earth-100 text-earth-800 dark:bg-earth-800 dark:text-earth-300 border border-earth-200 dark:border-earth-700',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
    red: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800',
    green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full ${variants[variant] || variants.forest} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
