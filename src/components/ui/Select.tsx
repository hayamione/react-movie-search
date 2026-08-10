import type { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label: string;
  options: SelectOption[];
  className?: string;
}

const ChevronDownIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const Select = ({ label, options, className = '', ...rest }: SelectProps) => (
  <label className={`flex flex-col gap-1.5 ${className}`}>
    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
      {label}
    </span>
    <div className="relative">
      <select
        {...rest}
        className="h-10 w-full appearance-none rounded-xl border border-slate-700 bg-slate-900 pl-3 pr-10 text-sm text-slate-100 shadow-soft transition-all duration-fast focus:border-accent focus:ring-2 focus:ring-accent/30 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
        <ChevronDownIcon />
      </span>
    </div>
  </label>
);

export default Select;
