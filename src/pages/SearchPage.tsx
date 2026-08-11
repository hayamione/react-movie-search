import { useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { SearchX } from 'lucide-react';
import type { Movie } from '../types/movie';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import GenreChip from '../components/ui/GenreChip';
import MovieCard from '../components/MovieCard';
import MovieGrid from '../components/ui/MovieGrid';
import MovieGridSkeleton from '../components/ui/MovieGridSkeleton';
import Pagination from '../components/ui/Pagination';
import SearchBar from '../components/ui/SearchBar';
import Section from '../components/ui/Section';
import Select from '../components/ui/Select';
import { useGenres } from '../hooks/useGenres';
import { useSearchMovies } from '../hooks/useSearchMovies';

const POPULAR_SEARCHES = [
  'Inception',
  'Dune',
  'Interstellar',
  'Avatar',
  'The Batman',
  'Oppenheimer',
];

type SortBy = 'popularity' | 'rating' | 'newest' | 'oldest' | 'title';

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title', label: 'Title A-Z' },
];

const sortMovies = (list: Movie[], sortBy: SortBy): Movie[] => {
  const sorted = [...list];
  switch (sortBy) {
    case 'rating':
      sorted.sort((a, b) => (b.voteAverage ?? 0) - (a.voteAverage ?? 0));
      break;
    case 'newest':
      sorted.sort((a, b) => (b.releaseDate ?? '').localeCompare(a.releaseDate ?? ''));
      break;
    case 'oldest':
      sorted.sort((a, b) => (a.releaseDate ?? '').localeCompare(b.releaseDate ?? ''));
      break;
    case 'title':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break;
  }
  return sorted;
};

const NoResultsIllustration = () => (
  <SearchX className="h-12 w-12" aria-hidden="true" strokeWidth={1.75} />
);

const SearchHeader = ({ children }: PropsWithChildren) => (
  <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
    />
    <div className="relative flex flex-col items-center gap-7 p-6 sm:p-10 lg:p-14">
      <div className="max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Explore</p>
        <h1 className="mt-2 text-balance text-3xl font-extrabold leading-tight tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
          Find Your Next Favorite Movie
        </h1>
        <p className="mx-auto mt-3 max-w-prose text-base leading-relaxed text-slate-400 sm:text-lg">
          Search across millions of movies and discover your next watch.
        </p>
      </div>
      {children}
    </div>
  </section>
);

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [year, setYear] = useState('');
  const [genreId, setGenreId] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('popularity');

  const { genres } = useGenres();

  const { movies, loading, error, refetch, totalPages, totalResults } = useSearchMovies({
    query: submittedQuery,
    page,
    year: year ? Number(year) : undefined,
    genreId: genreId ? Number(genreId) : undefined,
  });

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSubmittedQuery('');
      setPage(1);
      return;
    }
    const timer = window.setTimeout(() => {
      setSubmittedQuery(trimmed);
      setPage(1);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [query]);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    setSubmittedQuery(trimmed);
    setPage(1);
  };

  const handlePopularSearch = (term: string) => {
    setQuery(term);
    setSubmittedQuery(term);
    setPage(1);
  };

  const handleFilterChange =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };

  const clearFilters = () => {
    setYear('');
    setGenreId('');
    setSortBy('popularity');
    setPage(1);
  };

  const sortedMovies = useMemo(() => sortMovies(movies, sortBy), [movies, sortBy]);

  const hasSearched = submittedQuery.trim() !== '';
  const hasActiveFilters = year !== '' || genreId !== '' || sortBy !== 'popularity';

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: '', label: 'All years' },
    ...Array.from({ length: currentYear - 1900 + 1 }, (_, index) => {
      const value = String(currentYear - index);
      return { value, label: value };
    }),
  ];
  const genreOptions = [
    { value: '', label: 'All genres' },
    ...genres.map((genre) => ({ value: String(genre.id), label: genre.name })),
  ];

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      <SearchHeader>
        <SearchBar
          size="lg"
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          loading={hasSearched && loading}
          placeholder="Search for a movie..."
          aria-label="Search movies"
          className="max-w-2xl"
        />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Popular
          </span>
          {POPULAR_SEARCHES.map((term) => (
            <GenreChip
              key={term}
              label={term}
              active={query === term}
              onClick={() => handlePopularSearch(term)}
            />
          ))}
        </div>
      </SearchHeader>

      {hasSearched && (
        <Section title="Filters" subtitle="Narrow down your search results.">
          <div className="flex flex-wrap items-end gap-4">
            <Select
              label="Year"
              value={year}
              onChange={(event) => handleFilterChange(setYear)(event.target.value)}
              options={yearOptions}
            />
            <Select
              label="Genre"
              value={genreId}
              onChange={(event) => handleFilterChange(setGenreId)(event.target.value)}
              options={genreOptions}
            />
            <Select
              label="Sort by"
              value={sortBy}
              onChange={(event) => handleFilterChange(setSortBy)(event.target.value as SortBy)}
              options={SORT_OPTIONS}
            />
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        </Section>
      )}

      <Section
        title="Results"
        subtitle={
          hasSearched && !loading && !error && sortedMovies.length > 0
            ? `${totalResults.toLocaleString()} ${totalResults === 1 ? 'result' : 'results'} found`
            : undefined
        }
      >
        {!hasSearched ? (
          <EmptyState
            icon={<NoResultsIllustration />}
            title="Search to begin"
            description="Type a movie title above or choose one of the popular searches to get started."
          />
        ) : loading ? (
          <MovieGridSkeleton columns={5} count={10} />
        ) : error ? (
          <EmptyState tone="error" onRetry={refetch} description="We couldn't load the search results." />
        ) : sortedMovies.length === 0 ? (
          <EmptyState
            icon={<NoResultsIllustration />}
            title="No results found"
            description={`We couldn't find anything matching "${submittedQuery}". Try different keywords or clear your filters.`}
            action={
              hasActiveFilters ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <MovieGrid columns={5}>
              {sortedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </MovieGrid>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-10"
            />
          </>
        )}
      </Section>
    </div>
  );
};

export default SearchPage;
