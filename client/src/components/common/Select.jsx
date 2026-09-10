import React, { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  options = [],
  error,
  helperText,
  className = '',
  containerClassName = '',
  id,
  required = false,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold uppercase tracking-wider text-earth-700 dark:text-earth-300 mb-1.5"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <select
        ref={ref}
        id={selectId}
        className={`
          w-full rounded-xl border bg-white dark:bg-earth-900 
          text-earth-900 dark:text-earth-100 text-sm
          py-2.5 px-3.5 transition-all duration-200
          focus:outline-none focus:ring-2
          ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : 'border-earth-300 dark:border-earth-700 focus:border-forest-500 focus:ring-forest-100 dark:focus:ring-forest-950'
          }
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => {
          const value = typeof opt === 'object' ? opt.value : opt;
          const labelText = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={value} value={value} className="bg-white dark:bg-earth-900">
              {labelText}
            </option>
          );
        })}
      </select>

      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
      {!error && helperText && (
        <p className="mt-1 text-xs text-earth-500 dark:text-earth-400">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
