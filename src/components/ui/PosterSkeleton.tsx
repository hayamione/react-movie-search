import Skeleton from './Skeleton';

interface PosterSkeletonProps {
  className?: string;
}

const PosterSkeleton = ({ className = '' }: PosterSkeletonProps) => (
  <Skeleton className={`aspect-[2/3] w-full rounded-xl ${className}`} />
);

export default PosterSkeleton;