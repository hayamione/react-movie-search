import type { EntityId } from '../../types/common';
import { useMovieDetails } from '../../hooks/useMovieDetails';
import MovieDetailsHero from '../../components/movie-details/MovieDetailsHero';
import MovieMetadataSection from '../../components/movie-details/MovieMetadataSection';
import MovieCreditsSection from '../../components/movie-details/MovieCreditsSection';
import MovieExtrasSection from '../../components/movie-details/MovieExtrasSection';
import SimilarMoviesSection from '../../components/movie-details/SimilarMoviesSection';
import RecommendationsSection from '../../components/movie-details/RecommendationsSection';

interface MovieDetailsPageProps {
  movieId?: EntityId;
}

const MovieDetailsPage = ({ movieId }: MovieDetailsPageProps) => {
  const { data: movie, loading, error, refetch } = useMovieDetails(movieId);

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      <MovieDetailsHero movie={movie} loading={loading} error={error} onRetry={refetch} />

      <MovieMetadataSection movie={movie} />

      <MovieCreditsSection movieId={movieId} />

      <MovieExtrasSection movie={movie} movieId={movieId} />

      <SimilarMoviesSection movieId={movieId} />

      <RecommendationsSection movieId={movieId} />
    </div>
  );
};

export default MovieDetailsPage;