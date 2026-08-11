import PosterSkeleton from './PosterSkeleton';
import Skeleton from './Skeleton';

interface MovieCardSkeletonProps {
  className?: string;
}

const MovieCardSkeleton = ({ className = '' }: MovieCardSkeletonProps) => (
  <div
    className={`flex h-full flex-col overflow-hidden rounded-2xl bg-slate-900 ${className}`}
    aria-hidden="true"
  >
    <PosterSkeleton />
    <div className="flex flex-1 flex-col gap-3 p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="mt-1 flex items-center justify-between gap-2">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-5 w-14" />
      </div>
      <div className="mt-1 flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  </div>
);

export default MovieCardSkeleton;