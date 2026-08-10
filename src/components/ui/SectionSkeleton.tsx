import MovieCardSkeleton from './MovieCardSkeleton';

interface SectionSkeletonProps {
  showTitle?: boolean;
  cards?: number;
  className?: string;
}

const SectionSkeleton = ({
  showTitle = true,
  cards = 4,
  className = '',
}: SectionSkeletonProps) => (
  <div className={className} aria-hidden="true">
    {showTitle && (
      <div className="h-7 w-48 animate-pulse rounded-xl bg-slate-800 sm:h-8" />
    )}
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: cards }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

export default SectionSkeleton;
