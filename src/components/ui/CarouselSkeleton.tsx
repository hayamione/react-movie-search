import Carousel from './Carousel';
import MovieCardSkeleton from './MovieCardSkeleton';
import PosterSkeleton from './PosterSkeleton';
import Skeleton from './Skeleton';

type CarouselSkeletonVariant = 'movie' | 'cast';

interface CarouselSkeletonProps {
  variant?: CarouselSkeletonVariant;
  cards?: number;
  className?: string;
}

const cardWidth = 'w-40 shrink-0 sm:w-48';

const CastItem = () => (
  <div className={`${cardWidth} shrink-0`}>
    <PosterSkeleton className="rounded-2xl" />
    <div className="mt-3 space-y-2 px-0.5">
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

const CarouselSkeleton = ({ variant = 'movie', cards = 8, className = '' }: CarouselSkeletonProps) => (
  <Carousel className={className}>
    {Array.from({ length: cards }).map((_, index) =>
      variant === 'cast' ? <CastItem key={index} /> : <MovieCardSkeleton key={index} className={cardWidth} />
    )}
  </Carousel>
);

export default CarouselSkeleton;