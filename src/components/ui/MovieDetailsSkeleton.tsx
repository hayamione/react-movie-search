import CarouselSkeleton from './CarouselSkeleton';
import CrewSkeleton from './CrewSkeleton';
import HeroSkeleton from './HeroSkeleton';
import MovieMetadataSkeleton from './MovieMetadataSkeleton';
import Section from './Section';
import Skeleton from './Skeleton';

const MovieDetailsSkeleton = () => (
  <div className="flex flex-col gap-12 sm:gap-16" aria-hidden="true">
    <HeroSkeleton />

    <MovieMetadataSkeleton />

    <Section title="Cast & Crew" subtitle="The people who brought this story to life.">
      <CarouselSkeleton variant="cast" cards={8} />
      <div className="mt-12">
        <CrewSkeleton count={4} />
      </div>
    </Section>

    <Section title="Trailer" subtitle="Watch the official trailer.">
      <Skeleton className="aspect-video w-full rounded-2xl" />
    </Section>

    <CarouselSkeleton variant="movie" cards={5} />
  </div>
);

export default MovieDetailsSkeleton;