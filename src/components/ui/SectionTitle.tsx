import type { ReactNode } from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

const SectionTitle = ({ title, subtitle, action, className = '' }: SectionTitleProps) => (
  <div
    className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 ${className}`}
  >
    <div className="max-w-3xl">
      <h2 className="text-balance text-2xl font-bold leading-tight tracking-tight text-slate-100 sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1.5 text-sm leading-relaxed text-slate-400 sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
    {action && <div className="shrink-0 self-start sm:self-auto">{action}</div>}
  </div>
);

export default SectionTitle;
