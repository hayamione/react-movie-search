import type { ReactNode } from 'react';
import Button from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  secondaryAction?: ReactNode;
  className?: string;
}

const ErrorIcon = () => (
  <svg
    className="h-8 w-8"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ErrorState = ({
  title = 'Something went wrong',
  description,
  onRetry,
  retryLabel = 'Try again',
  secondaryAction,
  className = '',
}: ErrorStateProps) => (
  <div
    role="alert"
    className={`flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 px-6 py-16 text-center ${className}`}
  >
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
      <ErrorIcon />
    </div>
    <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
    {description && <p className="max-w-md text-sm text-slate-400">{description}</p>}
    {(onRetry || secondaryAction) && (
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            {retryLabel}
          </Button>
        )}
        {secondaryAction}
      </div>
    )}
  </div>
);

export default ErrorState;
