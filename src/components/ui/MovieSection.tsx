import type { Movie } from '../../types/movie';
import MovieCard from '../MovieCard';
import MovieCarousel from './MovieCarousel';
import EmptyState from './EmptyState';
import MovieGrid from './MovieGrid';
import type { GridColumns } from './MovieGrid';
import Section from './Section';
import SectionSkeleton from './SectionSkeleton';

interface MovieSectionProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
  horizontal?: boolean;
  cards?: number;
  columns?: GridColumns;
}

const MovieSection = ({
  title,
  subtitle,
  movies,
  loading,
  error,
  onRetry,
  horizontal = false,
  cards = 5,
  columns = 5,
}: MovieSectionProps) => {
  if (loading) {
    return (
      <Section title={title} subtitle={subtitle}>
        <SectionSkeleton showTitle={false} cards={cards} />
      </Section>
    );
  }

  if (error) {
    return (
      <Section title={title} subtitle={subtitle}>
        <EmptyState
          tone="error"
          onRetry={onRetry}
          description={`Unable to load ${title.toLowerCase()} right now.`}
        />
      </Section>
    );
  }

  if (movies.length === 0) {
    return (
      <Section title={title} subtitle={subtitle}>
        <EmptyState
          title="No movies found"
          description={`We could not find any movies for ${title.toLowerCase()}.`}
        />
      </Section>
    );
  }

  return (
    <Section title={title} subtitle={subtitle}>
      {horizontal ? (
        <MovieCarousel movies={movies} />
      ) : (
        <MovieGrid columns={columns}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </MovieGrid>
      )}
    </Section>
  );
};

export default MovieSection;
