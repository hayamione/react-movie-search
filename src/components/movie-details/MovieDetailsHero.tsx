import { Fragment, useEffect, useState } from 'react';
import type { MovieDetails } from '../../types/movie';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import GenreChip from '../ui/GenreChip';
import Poster from '../ui/Poster';
import RatingBadge from '../ui/RatingBadge';
import { formatRuntime } from '../../utils/format';

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    className={`h-4 w-4 ${filled ? 'fill-current' : 'fill-none stroke-current'}`}
    viewBox="0 0 24 24"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const scrollToTrailer = () => {
  document.getElementById('trailer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

interface MovieDetailsHeroProps {
  movie: MovieDetails | null;
  error: Error | null;
  onRetry: () => void;
}

const MovieDetailsHero = ({ movie, error, onRetry }: MovieDetailsHeroProps) => {
  const [favorite, setFavorite] = useState(false);
  const [backdropErrored, setBackdropErrored] = useState(false);

  useEffect(() => {
    setFavorite(false);
    setBackdropErrored(false);
  }, [movie?.id]);

  if (error) {
    return (
      <ErrorState
        title="Unable to load this movie"
        description="We could not fetch the details for this movie. Please try again."
        onRetry={onRetry}
      />
    );
  }

  if (!movie) {
    return (
      <EmptyState
        title="Movie not found"
        description="We could not find a movie for this ID. It may have been removed or the ID is invalid."
      />
    );
  }

  const releaseYear = movie.releaseDate?.slice(0, 4);
  const runtimeLabel = formatRuntime(movie.runtime);
  const showOriginalTitle =
    Boolean(movie.originalTitle) && movie.originalTitle !== movie.title;
  const showBackdrop = Boolean(movie.backdropSrc) && !backdropErrored;

  const metaParts = [releaseYear, runtimeLabel].filter(
    (part): part is string => Boolean(part)
  );

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      {showBackdrop && (
        <img
          src={movie.backdropSrc}
          alt=""
          loading="eager"
          onError={() => setBackdropErrored(true)}
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
          <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
            {movie.title}
          </h1>

          {showOriginalTitle && (
            <p className="-mt-1 text-sm text-slate-400">
              Original title:{' '}
              <span className="font-medium italic text-slate-300">{movie.originalTitle}</span>
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {metaParts.length > 0 && (
              <span className="flex items-center gap-2 text-sm font-medium text-slate-400">
                {metaParts.map((part, index) => (
                  <Fragment key={part}>
                    {index > 0 && (
                      <span className="text-slate-600" aria-hidden="true">
                        ·
                      </span>
                    )}
                    {part}
                  </Fragment>
                ))}
              </span>
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
            <p className="max-w-prose text-base leading-relaxed text-slate-300">
              {movie.overview}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button
              variant={favorite ? 'primary' : 'secondary'}
              size="lg"
              aria-pressed={favorite}
              onClick={() => setFavorite((prev) => !prev)}
            >
              <HeartIcon filled={favorite} />
              {favorite ? 'Favorited' : 'Add to favorites'}
            </Button>
            <Button variant="ghost" size="lg" onClick={scrollToTrailer}>
              <PlayIcon />
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieDetailsHero;