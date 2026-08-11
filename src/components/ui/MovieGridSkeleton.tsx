import MovieCardSkeleton from './MovieCardSkeleton';
import MovieGrid from './MovieGrid';
import type { GridColumns } from './MovieGrid';

interface MovieGridSkeletonProps {
  columns?: GridColumns;
  count?: number;
  className?: string;
}

const MovieGridSkeleton = ({ columns = 5, count = 10, className = '' }: MovieGridSkeletonProps) => (
  <MovieGrid columns={columns} className={className}>
    {Array.from({ length: count }).map((_, index) => (
      <MovieCardSkeleton key={index} />
    ))}
  </MovieGrid>
);

export default MovieGridSkeleton;