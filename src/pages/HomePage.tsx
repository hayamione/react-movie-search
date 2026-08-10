import type { Movie } from '../types/movie';
import MovieCard from '../components/MovieCard';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import GenreChip from '../components/ui/GenreChip';
import MovieGrid from '../components/ui/MovieGrid';
import Poster from '../components/ui/Poster';
import RatingBadge from '../components/ui/RatingBadge';
import SearchBar from '../components/ui/SearchBar';
import Section from '../components/ui/Section';
import SectionSkeleton from '../components/ui/SectionSkeleton';
import { useGenres } from '../hooks/useGenres';
import {
  usePopularMovies,
  useTopRatedMovies,
  useTrendingMovies,
  useUpcomingMovies,
} from '../hooks/useMovies';

interface MovieSectionProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  loading: boolean;
  error: Error | null;
  onRetry: () => void;
  horizontal?: boolean;
  cards?: number;
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
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} className="w-40 shrink-0 sm:w-48" />
          ))}
        </div>
      ) : (
        <MovieGrid columns={5}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </MovieGrid>
      )}
    </Section>
  );
};

const HeroSkeleton = () => (
  <div
    className="animate-pulse rounded-2xl bg-slate-900 p-6 sm:p-8 lg:p-12"
    aria-hidden="true"
  >
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-12">
      <div className="aspect-[2/3] w-36 shrink-0 rounded-xl bg-slate-800 sm:w-44 lg:w-52" />
      <div className="flex flex-1 flex-col gap-4">
        <div className="h-10 w-2/3 rounded-xl bg-slate-800" />
        <div className="h-4 w-1/3 rounded-xl bg-slate-800" />
        <div className="h-4 w-3/4 rounded-xl bg-slate-800" />
        <div className="mt-2 flex flex-wrap gap-3">
          <div className="h-10 w-28 rounded-xl bg-slate-800" />
          <div className="h-10 w-36 rounded-xl bg-slate-800" />
        </div>
      </div>
    </div>
  </div>
);

interface HeroSectionProps {
  movie: Movie;
}

const HeroSection = ({ movie }: HeroSectionProps) => {
  const releaseYear = movie.releaseDate?.slice(0, 4);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="relative">
        {movie.backdropSrc && (
          <img
            src={movie.backdropSrc}
            alt=""
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent lg:block" />

        <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-end lg:gap-12 lg:p-12">
          <Poster
            src={movie.posterSrc}
            alt={movie.title}
            className="w-36 shrink-0 self-center sm:w-44 lg:w-52 lg:self-auto"
          />
          <div className="flex flex-1 flex-col gap-4">
            <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              {releaseYear && (
                <span className="text-sm font-medium text-slate-400">{releaseYear}</span>
              )}
              <RatingBadge rating={movie.voteAverage} />
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <GenreChip key={genre.id} label={genre.name} />
                  ))}
                </div>
              )}
            </div>

            {movie.tagline && (
              <p className="text-base font-medium italic text-amber-200/90">{movie.tagline}</p>
            )}
            {movie.overview && (
              <p className="line-clamp-3 max-w-prose text-base leading-relaxed text-slate-300">
                {movie.overview}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button variant="primary" size="lg">
                View Details
              </Button>
              <Button variant="ghost" size="lg">
                Add to Watchlist
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 p-6 sm:p-8 lg:p-12">
        <SearchBar placeholder="Search for movies..." className="mx-auto max-w-2xl" />
      </div>
    </section>
  );
};

const HomePage = () => {
  const {
    movies: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useTrendingMovies();
  const {
    movies: popularMovies,
    loading: popularLoading,
    error: popularError,
    refetch: refetchPopular,
  } = usePopularMovies();
  const {
    movies: topRatedMovies,
    loading: topRatedLoading,
    error: topRatedError,
    refetch: refetchTopRated,
  } = useTopRatedMovies();
  const {
    movies: upcomingMovies,
    loading: upcomingLoading,
    error: upcomingError,
    refetch: refetchUpcoming,
  } = useUpcomingMovies();
  const { genres, loading: genresLoading, error: genresError, refetch: refetchGenres } =
    useGenres();

  const featured = trendingMovies[0];

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      {trendingLoading ? (
        <HeroSkeleton />
      ) : trendingError ? (
        <ErrorState
          onRetry={refetchTrending}
          description="Unable to load the featured movie."
        />
      ) : featured ? (
        <HeroSection movie={featured} />
      ) : (
        <EmptyState title="No featured movie available" />
      )}

      <MovieSection
        title="Trending Today"
        subtitle="The most talked-about movies right now."
        horizontal
        movies={trendingMovies}
        loading={trendingLoading}
        error={trendingError}
        onRetry={refetchTrending}
        cards={6}
      />

      <MovieSection
        title="Popular Movies"
        subtitle="What everyone is watching."
        movies={popularMovies}
        loading={popularLoading}
        error={popularError}
        onRetry={refetchPopular}
      />

      <MovieSection
        title="Top Rated Movies"
        subtitle="The best of the best."
        movies={topRatedMovies}
        loading={topRatedLoading}
        error={topRatedError}
        onRetry={refetchTopRated}
      />

      <MovieSection
        title="Upcoming Movies"
        subtitle="Coming soon to theaters."
        movies={upcomingMovies}
        loading={upcomingLoading}
        error={upcomingError}
        onRetry={refetchUpcoming}
      />

      <Section title="Browse by Genre" subtitle="Explore movies by genre.">
        {genresLoading ? (
          <div className="flex flex-wrap gap-2" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-8 w-20 animate-pulse rounded-xl bg-slate-800"
              />
            ))}
          </div>
        ) : genresError ? (
          <ErrorState onRetry={refetchGenres} description="Unable to load genres." />
        ) : genres.length === 0 ? (
          <EmptyState title="No genres available" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <GenreChip key={genre.id} label={genre.name} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default HomePage;
