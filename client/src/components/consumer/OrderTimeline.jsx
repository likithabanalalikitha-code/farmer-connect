import React from 'react';
import { Check, Clock, PackageCheck, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Farmer Confirmed', icon: PackageCheck },
  { key: 'processing', label: 'Harvesting & Packed', icon: Check },
  { key: 'shipped', label: 'In Transit', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 }
];

const OrderTimeline = ({ currentStatus = 'pending', timeline = [] }) => {
  const isCancelled = currentStatus === 'cancelled';

  if (isCancelled) {
    return (
      <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-3">
        <XCircle className="w-6 h-6 text-red-600 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
            Order Cancelled
          </h4>
          <p className="text-xs text-red-700 dark:text-red-300">
            This order was cancelled and inventory has been returned to the farmer.
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.key === currentStatus);
  const activeStepIdx = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-earth-200 dark:bg-earth-800 -z-0" />

        {/* Active Progress Bar */}
        <div
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-forest-600 dark:bg-forest-400 transition-all duration-500 -z-0"
          style={{ width: `${(activeStepIdx / (STEPS.length - 1)) * 100}%` }}
        />

        {/* Step Nodes */}
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < activeStepIdx;
          const isCurrent = idx === activeStepIdx;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm
                  ${
                    isCompleted
                      ? 'bg-forest-600 text-white shadow-glow-green'
                      : isCurrent
                      ? 'bg-forest-500 text-white ring-4 ring-forest-100 dark:ring-forest-950 shadow-md animate-pulse'
                      : 'bg-white dark:bg-earth-900 border-2 border-earth-300 dark:border-earth-700 text-earth-400'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] font-semibold mt-2 text-center max-w-[80px] leading-tight ${
                  isCompleted || isCurrent
                    ? 'text-earth-900 dark:text-white'
                    : 'text-earth-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Timeline Event History List */}
      {timeline.length > 0 && (
        <div className="mt-8 pt-6 border-t border-earth-100 dark:border-earth-800 space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-earth-500">
            Tracking History
          </h5>
          <div className="space-y-2">
            {timeline.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between text-xs py-1.5 border-b border-earth-50 dark:border-earth-800/40"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-forest-600" />
                  <span className="font-semibold text-earth-900 dark:text-white capitalize">
                    {item.status}
                  </span>
                  {item.note && (
                    <span className="text-earth-500">— {item.note}</span>
                  )}
                </div>
                <span className="text-earth-400 shrink-0">
                  {formatDate(item.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
