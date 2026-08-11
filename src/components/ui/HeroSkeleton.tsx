import Skeleton from './Skeleton';

const HeroSkeleton = ({ rounded = 'rounded-2xl' }: { rounded?: string }) => (
  <div className={`animate-pulse bg-slate-900 p-6 sm:p-8 lg:p-12 ${rounded}`} aria-hidden="true">
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-12">
      <Skeleton className="aspect-[2/3] w-36 shrink-0 rounded-xl sm:w-44 lg:w-52" />
      <div className="flex flex-1 flex-col gap-4">
        <Skeleton className="h-10 w-2/3 sm:h-12" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="hidden h-4 w-2/3 sm:block" />
        <div className="mt-2 flex flex-wrap gap-3">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </div>
  </div>
);

export default HeroSkeleton;