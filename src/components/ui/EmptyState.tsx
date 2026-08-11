import type { ReactNode } from 'react';
import { CircleAlert, Clapperboard } from 'lucide-react';
import Button from './Button';

type EmptyStateTone = 'default' | 'error';

interface EmptyStateProps {
  tone?: EmptyStateTone;
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

const toneIconStyles: Record<EmptyStateTone, string> = {
  default: 'bg-slate-800/60 text-slate-400',
  error: 'bg-rose-500/10 text-rose-400',
};

const defaultTitles: Record<EmptyStateTone, string> = {
  default: 'Nothing here yet',
  error: 'Something went wrong',
};

const defaultIcons: Record<EmptyStateTone, ReactNode> = {
  default: <Clapperboard className="h-8 w-8" aria-hidden="true" strokeWidth={1.75} />,
  error: <CircleAlert className="h-8 w-8" aria-hidden="true" strokeWidth={1.75} />,
};

const EmptyState = ({
  tone = 'default',
  icon,
  title,
  description,
  action,
  onRetry,
  retryLabel = 'Try again',
  className = '',
}: EmptyStateProps) => {
  const showAction = Boolean(action) || Boolean(onRetry);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 px-6 py-16 text-center ${className}`}
    >
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${toneIconStyles[tone]}`}
      >
        {icon ?? defaultIcons[tone]}
      </div>
      <h2 className="text-lg font-semibold text-slate-100">{title ?? defaultTitles[tone]}</h2>
      {description && <p className="max-w-md text-sm text-slate-400">{description}</p>}
      {showAction && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {action}
          {onRetry && (
            <Button onClick={onRetry} variant="secondary">
              {retryLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;