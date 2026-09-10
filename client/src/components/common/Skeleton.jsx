import React from 'react';

export const Skeleton = ({ className = '', rounded = 'rounded-xl' }) => {
  return (
    <div
      className={`animate-shimmer bg-earth-200 dark:bg-earth-800 ${rounded} ${className}`}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-earth-900 rounded-2xl border border-earth-200 dark:border-earth-800 overflow-hidden shadow-subtle p-4 space-y-3">
      <Skeleton className="w-full h-48 rounded-xl" />
      <div className="flex justify-between items-center">
        <Skeleton className="w-20 h-5 rounded-full" />
        <Skeleton className="w-16 h-4" />
      </div>
      <Skeleton className="w-3/4 h-6" />
      <Skeleton className="w-1/2 h-4" />
      <div className="pt-2 flex justify-between items-center">
        <Skeleton className="w-24 h-7" />
        <Skeleton className="w-24 h-9 rounded-xl" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ columns = 5 }) => {
  return (
    <tr className="border-b border-earth-100 dark:border-earth-800">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="px-6 py-4">
          <Skeleton className="w-full h-5" />
        </td>
      ))}
    </tr>
  );
};

export default Skeleton;
