import type { Movie } from '../types/movie';
import PageMeta from '../components/seo/PageMeta';
import Button from '../components/ui/Button';
import ChipSkeleton from '../components/ui/ChipSkeleton';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import GenreChip from '../components/ui/GenreChip';
import HeroSkeleton from '../components/ui/HeroSkeleton';
import MovieSection from '../components/ui/MovieSection';
import Poster from '../components/ui/Poster';
import RatingBadge from '../components/ui/RatingBadge';
import RecentlyViewedCarousel from '../components/ui/RecentlyViewedCarousel';
import SearchBar from '../components/ui/SearchBar';
import Section from '../components/ui/Section';
import { useGenres } from '../hooks/useGenres';
import {
  usePopularMovies,
  useTopRatedMovies,
  useTrendingMovies,
  useUpcomingMovies,
} from '../hooks/useMovies';

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
            className="w-36 shrink-0 self-center sm:w-44 lg:w-52 lg:self-auto rounded-xl"
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
      <PageMeta
        title="Discover Movies"
        brand="prefix"
        description="Browse trending, popular, top-rated and upcoming movies. Search across genres and find your next favorite film."
      />
      {trendingLoading ? (
        <HeroSkeleton />
      ) : trendingError ? (
        <ErrorState
          title="Unable to load the featured movie"
          description="We could not fetch the featured movie right now. Please try again."
          onRetry={refetchTrending}
        />
      ) : featured ? (
        <HeroSection movie={featured} />
      ) : (
        <EmptyState title="No featured movie available right now." />
      )}

      <RecentlyViewedCarousel />

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
          <ChipSkeleton count={8} />
        ) : genresError ? (
          <ErrorState
            title="Unable to load genres"
            description="We could not fetch genres right now. Please try again."
            onRetry={refetchGenres}
          />
        ) : genres.length === 0 ? (
          <EmptyState title="No genres available right now." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <GenreChip key={genre.id} label={genre.name} href={`/genre/${genre.id}`} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default HomePage;
