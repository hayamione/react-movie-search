interface PosterSkeletonProps {
  className?: string;
}

const PosterSkeleton = ({ className = '' }: PosterSkeletonProps) => (
  <div
    className={`aspect-[2/3] w-full animate-pulse rounded-xl bg-slate-800 ${className}`}
    aria-hidden="true"
  />
);

export default PosterSkeleton;
