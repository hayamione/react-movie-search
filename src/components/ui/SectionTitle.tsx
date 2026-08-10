import type { ReactNode } from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

const SectionTitle = ({ title, subtitle, action, className = '' }: SectionTitleProps) => (
  <div
    className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${className}`}
  >
    <div>
      <h2 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-400 sm:text-base">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default SectionTitle;
