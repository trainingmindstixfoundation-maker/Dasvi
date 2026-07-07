import React, { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: {
    value: string | number;
    label: string;
  }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full appearance-none px-4 py-2.5 rounded-lg border border-slate-300 dark:border-dark-border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
