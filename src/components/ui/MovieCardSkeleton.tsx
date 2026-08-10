import PosterSkeleton from './PosterSkeleton';

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
      <div className="h-4 w-3/4 animate-pulse rounded-xl bg-slate-800" />
      <div className="h-4 w-1/2 animate-pulse rounded-xl bg-slate-800" />
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="h-3 w-10 animate-pulse rounded-xl bg-slate-800" />
        <div className="h-5 w-14 animate-pulse rounded-xl bg-slate-800" />
      </div>
      <div className="mt-1 flex flex-wrap gap-2">
        <div className="h-6 w-16 animate-pulse rounded-xl bg-slate-800" />
        <div className="h-6 w-24 animate-pulse rounded-xl bg-slate-800" />
      </div>
    </div>
  </div>
);

export default MovieCardSkeleton;
