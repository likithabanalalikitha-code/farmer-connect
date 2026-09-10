import React from 'react';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatters';

const SalesChart = ({ data = [] }) => {
  const chartData = data;
  const maxAmount = Math.max(...chartData.map((d) => d.amount), 1000);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-base font-bold text-earth-900 dark:text-white">
            Crop Revenue Overview
          </h4>
          <p className="text-xs text-earth-500">
            Monthly verified direct farmer sales (₹)
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-forest-50 text-forest-700 dark:bg-forest-950 dark:text-forest-400">
          Last 6 Months
        </span>
      </div>

      <div className="h-56 flex items-end justify-between gap-3 pt-4 border-b border-earth-100 dark:border-earth-800">
        {chartData.length === 0 ? (
          <p className="w-full text-center text-xs text-earth-400 pb-20">No completed sales recorded yet.</p>
        ) : chartData.map((item, idx) => {
          const heightPercent = Math.max(12, Math.round((item.amount / maxAmount) * 100));
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              {/* Tooltip on hover */}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-forest-700 dark:text-forest-400">
                {formatCurrency(item.amount)}
              </span>
              <div
                className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-forest-700 to-forest-500 dark:from-forest-600 dark:to-emerald-400 group-hover:brightness-110 transition-all cursor-pointer shadow-sm"
                style={{ height: `${heightPercent}%` }}
              />
              <span className="text-xs font-semibold text-earth-500 group-hover:text-earth-900 dark:group-hover:text-white transition-colors">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SalesChart;
