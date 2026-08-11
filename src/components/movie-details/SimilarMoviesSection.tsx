import type { EntityId } from '../../types/common';
import { useSimilarMovies } from '../../hooks/useSimilarMovies';
import MovieSection from '../ui/MovieSection';

interface SimilarMoviesSectionProps {
  movieId?: EntityId;
}

const SimilarMoviesSection = ({ movieId }: SimilarMoviesSectionProps) => {
  const { data: movies, loading, error, refetch } = useSimilarMovies(movieId);

  return (
    <MovieSection
      title="Similar Movies"
      subtitle="Movies like this one."
      movies={movies ?? []}
      loading={loading}
      error={error}
      onRetry={refetch}
      horizontal
      cards={6}
    />
  );
};

export default SimilarMoviesSection;