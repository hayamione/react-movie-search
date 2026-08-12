import { useEffect } from 'react';
import type { EntityId } from '../../types/common';
import { useMovieDetails } from '../../hooks/useMovieDetails';
import { useRecentlyViewed } from '../../recently-viewed/RecentlyViewedContext';
import PageMeta from '../../components/seo/PageMeta';
import MovieDetailsSkeleton from '../../components/ui/MovieDetailsSkeleton';
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
  const { addRecent } = useRecentlyViewed();

  useEffect(() => {
    if (movie) {
      addRecent(movie);
    }
  }, [movie, addRecent]);

  if (loading) {
    return <MovieDetailsSkeleton />;
  }

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      <PageMeta
        title={movie?.title ? `${movie.title}` : 'Movie'}
        description={movie?.overview?.slice(0, 160)}
        image={movie?.backdropSrc ?? movie?.posterSrc}
      />

      <MovieDetailsHero movie={movie} error={error} onRetry={refetch} />

      <MovieMetadataSection movie={movie} />

      <MovieCreditsSection movieId={movieId} />

      <MovieExtrasSection movie={movie} movieId={movieId} />

      <SimilarMoviesSection movieId={movieId} />

      <RecommendationsSection movieId={movieId} />
    </div>
  );
};

export default MovieDetailsPage;