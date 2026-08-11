import type { EntityId } from '../../types/common';
import { useMovieDetails } from '../../hooks/useMovieDetails';
import MovieDetailsHero from '../../components/movie-details/MovieDetailsHero';
import MovieDetailsSkeleton from '../../components/movie-details/MovieDetailsSkeleton';
import RecommendationsSection from '../../components/movie-details/RecommendationsSection';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Section from '../../components/ui/Section';

interface MovieDetailsPageProps {
  movieId?: EntityId;
}

const MovieDetailsPage = ({ movieId }: MovieDetailsPageProps) => {
  const { data: movie, loading, error, refetch } = useMovieDetails(movieId);

  if (loading) {
    return <MovieDetailsSkeleton />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} description="Unable to load this movie." />;
  }

  if (!movie) {
    return (
      <EmptyState
        title="Movie not found"
        description="We could not find a movie for this ID. It may have been removed or the ID is invalid."
      />
    );
  }

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      <MovieDetailsHero movie={movie} />

      <Section title="Cast" subtitle="The actors who brought this story to life.">
        <EmptyState
          title="Cast coming soon"
          description="The full cast list will appear here once movie data is available."
        />
      </Section>

      <Section title="Crew" subtitle="The people behind the scenes.">
        <EmptyState
          title="Crew coming soon"
          description="The crew credits will appear here once movie data is available."
        />
      </Section>

      <Section title="Trailer" subtitle="Watch the official trailer.">
        <EmptyState
          title="Trailer coming soon"
          description="The official trailer will appear here once movie data is available."
        />
      </Section>

      <Section title="Production Companies" subtitle="The studios behind the movie.">
        <EmptyState
          title="Production companies coming soon"
          description="The production companies will appear here once movie data is available."
        />
      </Section>

      <Section title="Spoken Languages" subtitle="Languages featured in the movie.">
        <EmptyState
          title="Spoken languages coming soon"
          description="The spoken languages will appear here once movie data is available."
        />
      </Section>

      <RecommendationsSection movieId={movieId} />
    </div>
  );
};

export default MovieDetailsPage;