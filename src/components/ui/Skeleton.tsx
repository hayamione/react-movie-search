interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className = 'h-4 w-full' }: SkeletonProps) => (
  <div className={`animate-pulse rounded-xl bg-slate-800 ${className}`} aria-hidden="true" />
);

export default Skeleton;