import type { PropsWithChildren } from 'react';

interface ContainerProps extends PropsWithChildren {
  className?: string;
}

const Container = ({ children, className = '' }: ContainerProps) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

export default Container;
