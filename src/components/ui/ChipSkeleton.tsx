import Skeleton from './Skeleton';

interface ChipSkeletonProps {
  count?: number;
  className?: string;
}

const ChipSkeleton = ({ count = 8, className = 'h-8 w-20' }: ChipSkeletonProps) => (
  <div className="flex flex-wrap gap-2" aria-hidden="true">
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} className={className} />
    ))}
  </div>
);

export default ChipSkeleton;