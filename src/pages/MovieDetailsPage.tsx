import { Fragment } from 'react';
import type { MovieDetails } from '../types/movie';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import GenreChip from '../components/ui/GenreChip';
import Poster from '../components/ui/Poster';
import RatingBadge from '../components/ui/RatingBadge';
import Section from '../components/ui/Section';

const formatRuntime = (runtime?: number) => {
  if (runtime === undefined || runtime <= 0) {
    return undefined;
  }
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

interface MovieDetailsHeroProps {
  movie: MovieDetails;
}

const MovieDetailsHero = ({ movie }: MovieDetailsHeroProps) => {
  const releaseYear = movie.releaseDate?.slice(0, 4);
  const runtimeLabel = formatRuntime(movie.runtime);
  const showOriginalTitle =
    Boolean(movie.originalTitle) && movie.originalTitle !== movie.title;

  const metaParts = [releaseYear, runtimeLabel].filter(
    (part): part is string => Boolean(part)
  );

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
            <Button variant="primary" size="lg">
              Watch Now
            </Button>
            <Button variant="secondary" size="lg">
              Add to Watchlist
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

interface MovieDetailsPageProps {
  movie: MovieDetails;
}

const MovieDetailsPage = ({ movie }: MovieDetailsPageProps) => (
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

    <Section title="Recommendations" subtitle="More movies you might enjoy.">
      <EmptyState
        title="Recommendations coming soon"
        description="Similar movies will appear here once movie data is available."
      />
    </Section>
  </div>
);

export default MovieDetailsPage;
