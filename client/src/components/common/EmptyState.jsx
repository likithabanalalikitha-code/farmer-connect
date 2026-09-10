import React from 'react';
import { Sprout } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = Sprout,
  title = 'No items found',
  description = 'There is nothing to display right now. Try adjusting your filters or search criteria.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl bg-white/50 dark:bg-earth-900/50 border border-dashed border-earth-300 dark:border-earth-700 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-forest-50 dark:bg-forest-950 flex items-center justify-center text-forest-600 dark:text-forest-400 mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-earth-900 dark:text-earth-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-earth-500 dark:text-earth-400 max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
