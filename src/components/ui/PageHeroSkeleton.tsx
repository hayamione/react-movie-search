import Skeleton from './Skeleton';

interface PageHeroSkeletonProps {
  className?: string;
}

const PageHeroSkeleton = ({ className = '' }: PageHeroSkeletonProps) => (
  <div
    className={`rounded-2xl border border-slate-800 bg-slate-900 px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12 ${className}`}
    aria-hidden="true"
  >
    <Skeleton className="h-3 w-24" />
    <div className="mt-3">
      <Skeleton className="h-9 w-2/3 sm:h-11" />
    </div>
    <div className="mt-3">
      <Skeleton className="h-4 w-4/5" />
    </div>
  </div>
);

export default PageHeroSkeleton;