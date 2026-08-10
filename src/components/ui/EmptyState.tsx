import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) => (
  <div
    className={`flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 px-6 py-16 text-center ${className}`}
  >
    {icon && (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-400">
        {icon}
      </div>
    )}
    <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
    {description && <p className="max-w-md text-sm text-slate-400">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export default EmptyState;
