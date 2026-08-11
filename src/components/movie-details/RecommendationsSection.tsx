import type { EntityId } from '../../types/common';
import { useRecommendedMovies } from '../../hooks/useRecommendedMovies';
import MovieSection from '../ui/MovieSection';

interface RecommendationsSectionProps {
  movieId?: EntityId;
}

const RecommendationsSection = ({ movieId }: RecommendationsSectionProps) => {
  const { data: movies, loading, error, refetch } = useRecommendedMovies(movieId);

  return (
    <MovieSection
      title="Recommendations"
      subtitle="More movies you might enjoy."
      movies={movies ?? []}
      loading={loading}
      error={error}
      onRetry={refetch}
      horizontal
      cards={6}
    />
  );
};

export default RecommendationsSection;