import Skeleton from './Skeleton';

interface MovieMetadataSkeletonProps {
  count?: number;
  className?: string;
}

const MovieMetadataSkeleton = ({ count = 8, className = '' }: MovieMetadataSkeletonProps) => (
  <div className={className} aria-hidden="true">
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <Skeleton className="h-3 w-20" />
          <div className="mt-2">
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default MovieMetadataSkeleton;