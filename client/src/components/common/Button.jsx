import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-forest-600 hover:bg-forest-700 text-white shadow-sm hover:shadow-glow-green focus:ring-forest-500 dark:bg-forest-500 dark:hover:bg-forest-600',
    harvest: 'bg-harvest-500 hover:bg-harvest-600 text-white shadow-sm focus:ring-harvest-400',
    secondary: 'bg-earth-200 hover:bg-earth-300 text-earth-800 dark:bg-earth-800 dark:hover:bg-earth-700 dark:text-earth-100 focus:ring-earth-400',
    outline: 'border border-forest-600 text-forest-700 hover:bg-forest-50 dark:border-forest-400 dark:text-forest-400 dark:hover:bg-earth-900 focus:ring-forest-500',
    ghost: 'text-earth-600 hover:bg-earth-100 dark:text-earth-300 dark:hover:bg-earth-800 focus:ring-earth-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
