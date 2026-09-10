import React from 'react';
import Card from '../common/Card';

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'forest'
}) => {
  const colorSchemes = {
    forest: 'bg-forest-50 text-forest-600 dark:bg-forest-950/60 dark:text-forest-400',
    harvest: 'bg-harvest-50 text-harvest-600 dark:bg-harvest-950/60 dark:text-harvest-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400'
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-earth-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-earth-900 dark:text-white">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-earth-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${colorSchemes[variant] || colorSchemes.forest}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default DashboardCard;
