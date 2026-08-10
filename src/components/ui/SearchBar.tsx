import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

interface SearchBarProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  loading?: boolean;
  placeholder?: string;
  'aria-label'?: string;
  className?: string;
}

const SearchIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ClearIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const Spinner = () => (
  <svg
    className="h-4 w-4 animate-spin"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const SearchBar = ({
  value,
  defaultValue = '',
  onChange,
  onSubmit,
  onClear,
  loading = false,
  placeholder = 'Search movies...',
  'aria-label': ariaLabel = 'Search movies',
  className = '',
}: SearchBarProps) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? (value ?? '') : internalValue;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(event.target.value);
    }
    onChange?.(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    onChange?.('');
    onClear?.();
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
        <SearchIcon />
      </span>
      <input
        type="search"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        enterKeyHint="search"
        spellCheck={false}
        className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900 pl-11 pr-11 text-sm text-slate-100 shadow-soft transition-all duration-fast placeholder:text-slate-500 focus:border-accent focus:ring-2 focus:ring-accent/30 focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {loading ? (
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Spinner />
        </span>
      ) : currentValue ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition-colors duration-fast hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ClearIcon />
        </button>
      ) : null}
    </form>
  );
};

export default SearchBar;
