import type { EntityId } from '../../types/common';
import type { Credit } from '../../types/credit';
import { useMovieCredits } from '../../hooks/useMovieCredits';
import CarouselSkeleton from '../ui/CarouselSkeleton';
import CrewSkeleton from '../ui/CrewSkeleton';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import Section from '../ui/Section';
import CastCarousel from './CastCarousel';
import CrewSection from './CrewSection';

interface MovieCreditsSectionProps {
  movieId?: EntityId;
}

const MovieCreditsSection = ({ movieId }: MovieCreditsSectionProps) => {
  const { data: credits, loading, error, refetch } = useMovieCredits(movieId);

  if (loading) {
    return (
      <>
        <Section title="Cast" subtitle="The actors who brought this story to life.">
          <CarouselSkeleton variant="cast" cards={8} />
        </Section>
        <Section title="Crew" subtitle="The people behind the scenes.">
          <CrewSkeleton count={4} />
        </Section>
      </>
    );
  }

  if (error) {
    return (
      <Section title="Cast & Crew" subtitle="The people who brought this story to life.">
        <ErrorState
          title="Unable to load the cast and crew"
          description="We could not fetch the cast and crew for this movie. Please try again."
          onRetry={refetch}
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