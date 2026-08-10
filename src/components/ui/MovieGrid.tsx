import type { PropsWithChildren } from 'react';

type GridColumns = 2 | 3 | 4 | 5 | 6;
type GridGap = 'sm' | 'md' | 'lg';

interface MovieGridProps extends PropsWithChildren {
  columns?: GridColumns;
  gap?: GridGap;
  className?: string;
}

const columnStyles: Record<GridColumns, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6',
};

const gapStyles: Record<GridGap, string> = {
  sm: 'gap-3 sm:gap-4',
  md: 'gap-4 sm:gap-6',
  lg: 'gap-6 sm:gap-8',
};

const MovieGrid = ({
  columns = 4,
  gap = 'md',
  children,
  className = '',
}: MovieGridProps) => (
  <div className={`grid ${columnStyles[columns]} ${gapStyles[gap]} ${className}`}>
    {children}
  </div>
);

export default MovieGrid;
