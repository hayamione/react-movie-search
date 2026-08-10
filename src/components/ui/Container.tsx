import type { ElementType, PropsWithChildren } from 'react';

interface ContainerProps extends PropsWithChildren {
  as?: ElementType;
  className?: string;
}

const Container = ({ as: Tag = 'div', children, className = '' }: ContainerProps) => (
  <Tag className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </Tag>
);

export default Container;
