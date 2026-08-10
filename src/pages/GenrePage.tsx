import type { Movie } from '../types/movie';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import GenreChip from '../components/ui/GenreChip';
import MovieSection from '../components/ui/MovieSection';
import Poster from '../components/ui/Poster';
import RatingBadge from '../components/ui/RatingBadge';
import { useGenres } from '../hooks/useGenres';
import { useGenrePage } from '../hooks/useGenrePage';

interface GenrePageProps {
  genreId?: number;
}

const HeroSkeleton = () => (
  <div
    className="animate-pulse rounded-2xl bg-slate-900 p-6 sm:p-8 lg:p-12"
    aria-hidden="true"
  >
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-12">
      <div className="aspect-[2/3] w-36 shrink-0 rounded-xl bg-slate-800 sm:w-44 lg:w-52" />
      <div className="flex flex-1 flex-col gap-4">
        <div className="h-4 w-1/4 rounded-xl bg-slate-800" />
        <div className="h-10 w-2/3 rounded-xl bg-slate-800" />
        <div className="h-4 w-1/3 rounded-xl bg-slate-800" />
        <div className="h-4 w-3/4 rounded-xl bg-slate-800" />
        <div className="h-4 w-2/3 rounded-xl bg-slate-800" />
      </div>
    </div>
  </div>
);

const GenrePageSkeleton = () => (
  <div className="flex flex-col gap-12 sm:gap-16">
    <div className="h-40 animate-pulse rounded-2xl bg-slate-900" aria-hidden="true" />
    <HeroSkeleton />
  </div>
);

interface GenreHeroProps {
  movie: Movie;
}

const GenreHero = ({ movie }: GenreHeroProps) => {
  const releaseYear = movie.releaseDate?.slice(0, 4);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      {movie.backdropSrc && (
        <img
          src={movie.backdropSrc}
          alt=""
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent lg:block" />

      <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-end lg:gap-12 lg:p-12">
        <Poster
          src={movie.posterSrc}
          alt={movie.title}
          className="w-36 shrink-0 self-center rounded-xl sm:w-44 lg:w-52 lg:self-auto"
        />
        <div className="flex flex-1 flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Featured</p>
          <h2 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-slate-50 sm:text-4xl">
            {movie.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {releaseYear && <span className="text-sm font-medium text-slate-400">{releaseYear}</span>}
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
        </div>
      </div>
    </section>
  );
};

const GenrePage = ({ genreId }: GenrePageProps) => {
  const {
    genres,
    loading: genresLoading,
    error: genresError,
    refetch: refetchGenres,
  } = useGenres();
  const { popular, topRated, newest, loading, error, refetch } = useGenrePage(genreId);

  const isInvalidId = genreId === undefined || !Number.isInteger(genreId) || genreId <= 0;

  if (isInvalidId) {
    return (
      <EmptyState
        title="Genre not found"
        description="We could not find a genre for this ID."
      />
    );
  }

  if (genresLoading) {
    return <GenrePageSkeleton />;
  }

  if (genresError) {
    return (
      <ErrorState onRetry={refetchGenres} description="Unable to load genre information." />
    );
  }

  const genre = genres.find((candidate) => candidate.id === genreId);

  if (!genre) {
    return (
      <EmptyState
        title="Genre not found"
        description={`There is no genre with ID ${genreId}.`}
      />
    );
  }

  const heroMovie = popular[0];

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      <header className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Browse by genre
        </p>
        <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
          {genre.name}
        </h1>
        <p className="mt-3 max-w-prose text-base leading-relaxed text-slate-400 sm:text-lg">
          Discover the most popular, top-rated and newest {genre.name.toLowerCase()} movies.
        </p>
      </header>

      {error ? (
        <ErrorState onRetry={refetch} description={`Unable to load ${genre.name} movies.`} />
      ) : (
        <>
          {loading ? (
            <HeroSkeleton />
          ) : heroMovie ? (
            <GenreHero movie={heroMovie} />
          ) : (
            <EmptyState
              title="No movies available"
              description={`We could not find any ${genre.name.toLowerCase()} movies right now.`}
            />
          )}

          <MovieSection
            title={`Popular ${genre.name}`}
            subtitle="The most-watched movies in this genre."
            horizontal
            movies={popular.slice(1)}
            loading={loading}
            error={error}
            onRetry={refetch}
            cards={10}
          />
          <MovieSection
            title={`Top ${genre.name}`}
            subtitle="The highest-rated movies in this genre."
            horizontal
            movies={topRated}
            loading={loading}
            error={error}
            onRetry={refetch}
            cards={10}
          />
          <MovieSection
            title={`Newest ${genre.name}`}
            subtitle="The latest releases in this genre."
            horizontal
            movies={newest}
            loading={loading}
            error={error}
            onRetry={refetch}
            cards={10}
          />
        </>
      )}
    </div>
  );
};

export default GenrePage;
