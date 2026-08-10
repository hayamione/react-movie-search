import type { PropsWithChildren, ReactNode } from 'react';
import SectionTitle from './SectionTitle';

interface SectionProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  background?: boolean;
  className?: string;
}

const Section = ({
  title,
  subtitle,
  action,
  background = false,
  children,
  className = '',
}: SectionProps) => {
  const hasTitle = title !== undefined;

  return (
    <section className={className}>
      {hasTitle && <SectionTitle title={title} subtitle={subtitle} action={action} />}
      <div
        className={`${hasTitle ? 'mt-6' : ''} ${
          background ? 'rounded-2xl bg-slate-900/50 p-6 sm:p-8' : ''
        }`}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;
