import type { Movie } from '../../types/movie';
import MovieCard from '../MovieCard';
import Carousel from './Carousel';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
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
        <ErrorState onRetry={onRetry} description={`Unable to load ${title.toLowerCase()}.`} />
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
        <Carousel>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} className="w-40 shrink-0 sm:w-48" />
          ))}
        </Carousel>
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
