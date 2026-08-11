import PageMeta from '../components/seo/PageMeta';
import ChipSkeleton from '../components/ui/ChipSkeleton';
import EmptyState from '../components/ui/EmptyState';
import GenreChip from '../components/ui/GenreChip';
import Section from '../components/ui/Section';
import { useGenres } from '../hooks/useGenres';

const GenresPage = () => {
  const { genres, loading, error, refetch } = useGenres();

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      <PageMeta
        title="Browse by Genre"
        description="Explore movies by genre — from action and comedy to drama and sci-fi."
      />
      <header className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Browse</p>
        <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
          Genres
        </h1>
        <p className="mt-3 max-w-prose text-base leading-relaxed text-slate-400 sm:text-lg">
          Pick a genre to explore its most popular, top-rated and newest movies.
        </p>
      </header>

      <Section title="All Genres" subtitle="Choose a genre to explore.">
        {loading ? (
          <ChipSkeleton count={12} />
        ) : error ? (
          <EmptyState tone="error" onRetry={refetch} description="Unable to load genres right now." />
        ) : genres.length === 0 ? (
          <EmptyState title="No genres available" />
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

export default GenresPage;
