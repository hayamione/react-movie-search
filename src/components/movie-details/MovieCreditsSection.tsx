import type { EntityId } from '../../types/common';
import type { Credit } from '../../types/credit';
import { useMovieCredits } from '../../hooks/useMovieCredits';
import Carousel from '../ui/Carousel';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import PosterSkeleton from '../ui/PosterSkeleton';
import Section from '../ui/Section';
import CastCarousel from './CastCarousel';
import CrewSection from './CrewSection';

interface MovieCreditsSectionProps {
  movieId?: EntityId;
}

const CastSkeleton = () => (
  <Section title="Cast" subtitle="The actors who brought this story to life.">
    <Carousel>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="w-36 shrink-0 sm:w-40">
          <PosterSkeleton className="rounded-2xl" />
          <div className="mt-3 space-y-2 px-0.5">
            <div className="h-3 w-3/4 animate-pulse rounded bg-slate-800" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-800" />
          </div>
        </div>
      ))}
    </Carousel>
  </Section>
);

const CrewSkeleton = () => (
  <Section title="Crew" subtitle="The people behind the scenes.">
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="h-3 w-16 animate-pulse rounded bg-slate-800" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-800" />
        </div>
      ))}
    </div>
  </Section>
);

const MovieCreditsSection = ({ movieId }: MovieCreditsSectionProps) => {
  const { data: credits, loading, error, refetch } = useMovieCredits(movieId);

  if (loading) {
    return (
      <>
        <CastSkeleton />
        <CrewSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <Section title="Cast & Crew" subtitle="The people who brought this story to life.">
        <ErrorState
          onRetry={refetch}
          description="Unable to load the cast and crew for this movie."
        />
      </Section>
    );
  }

  const cast: Credit[] = credits?.cast ?? [];
  const crew: Credit[] = credits?.crew ?? [];

  if (cast.length === 0 && crew.length === 0) {
    return (
      <Section title="Cast & Crew" subtitle="The people who brought this story to life.">
        <EmptyState title="No credits available" description="Credits could not be found for this movie." />
      </Section>
    );
  }

  return (
    <>
      <CastCarousel cast={cast} />
      <CrewSection crew={crew} />
    </>
  );
};

export default MovieCreditsSection;