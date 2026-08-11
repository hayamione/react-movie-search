import type { EntityId } from '../../types/common';
import { useMovieDetails } from '../../hooks/useMovieDetails';
import MovieDetailsHero from '../../components/movie-details/MovieDetailsHero';
import MovieMetadataSection from '../../components/movie-details/MovieMetadataSection';
import MovieCreditsSection from '../../components/movie-details/MovieCreditsSection';
import RecommendationsSection from '../../components/movie-details/RecommendationsSection';
import EmptyState from '../../components/ui/EmptyState';
import Section from '../../components/ui/Section';

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

      <div id="trailer" className="scroll-mt-20">
        <Section title="Trailer" subtitle="Watch the official trailer.">
          <EmptyState
            title="Trailer coming soon"
            description="The official trailer will appear here once movie data is available."
          />
        </Section>
      </div>

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