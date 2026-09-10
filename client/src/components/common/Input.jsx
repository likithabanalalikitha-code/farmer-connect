import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon = null,
  rightElement = null,
  type = 'text',
  className = '',
  containerClassName = '',
  id,
  required = false,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-earth-700 dark:text-earth-300 mb-1.5"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-earth-400 dark:text-earth-500">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            w-full rounded-xl border bg-white dark:bg-earth-900 
            text-earth-900 dark:text-earth-100 text-sm
            placeholder:text-earth-400 dark:placeholder:text-earth-500
            transition-all duration-200
            focus:outline-none focus:ring-2
            ${Icon ? 'pl-10' : 'pl-3.5'}
            ${rightElement ? 'pr-11' : 'pr-3.5'}
            py-2.5
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-950'
                : 'border-earth-300 dark:border-earth-700 focus:border-forest-500 focus:ring-forest-100 dark:focus:ring-forest-950'
            }
            ${className}
          `}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}

      {!error && helperText && (
        <p className="mt-1 text-xs text-earth-500 dark:text-earth-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
