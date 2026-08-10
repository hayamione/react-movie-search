import type { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

const PageHero = ({ eyebrow, title, description, children, className = '' }: PageHeroProps) => (
  <header
    className={`rounded-2xl border border-slate-800 bg-slate-900 px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12 ${className}`}
  >
    {eyebrow && (
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">{eyebrow}</p>
    )}
    <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
      {title}
    </h1>
    {description && (
      <p className="mt-3 max-w-prose text-base leading-relaxed text-slate-400 sm:text-lg">
        {description}
      </p>
    )}
    {children && <div className="mt-6">{children}</div>}
  </header>
);

export default PageHero;
