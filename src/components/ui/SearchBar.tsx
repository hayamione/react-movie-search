import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

type SearchBarSize = 'md' | 'lg';

interface SearchBarProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  loading?: boolean;
  placeholder?: string;
  size?: SearchBarSize;
  'aria-label'?: string;
  className?: string;
}

const SearchIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
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

const ClearIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
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

const Spinner = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
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

const sizeStyles = {
  md: {
    input: 'h-11 rounded-xl pl-11 pr-11 text-sm',
    iconPosition: 'left-3.5',
    iconSize: 'h-5 w-5',
    clearButton: 'right-2.5 h-8 w-8',
    spinner: 'h-4 w-4',
  },
  lg: {
    input: 'h-14 rounded-2xl pl-12 pr-12 text-base sm:h-16',
    iconPosition: 'left-4',
    iconSize: 'h-5 w-5 sm:h-6 sm:w-6',
    clearButton: 'right-3 h-9 w-9 sm:right-3.5',
    spinner: 'h-5 w-5',
  },
} as const;

const SearchBar = ({
  value,
  defaultValue = '',
  onChange,
  onSubmit,
  onClear,
  loading = false,
  placeholder = 'Search movies...',
  size = 'md',
  'aria-label': ariaLabel = 'Search movies',
  className = '',
}: SearchBarProps) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? (value ?? '') : internalValue;
  const styles = sizeStyles[size];

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
      <span
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 ${styles.iconPosition}`}
      >
        <SearchIcon className={styles.iconSize} />
      </span>
      <input
        type="search"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        enterKeyHint="search"
        spellCheck={false}
        className={`w-full border border-slate-700 bg-slate-900 text-slate-100 shadow-soft transition-all duration-fast placeholder:text-slate-500 focus:border-accent focus:ring-2 focus:ring-accent/30 focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden ${styles.input}`}
      />
      {loading ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Spinner className={styles.spinner} />
        </span>
      ) : currentValue ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className={`absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition-colors duration-fast hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${styles.clearButton}`}
        >
          <ClearIcon className="h-4 w-4" />
        </button>
      ) : null}
    </form>
  );
};

export default SearchBar;
