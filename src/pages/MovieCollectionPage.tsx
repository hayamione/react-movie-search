import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { MovieCollectionEndpoint } from '../services/api/collection.service';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import MovieGrid from '../components/ui/MovieGrid';
import MovieGridSkeleton from '../components/ui/MovieGridSkeleton';
import PageHero from '../components/ui/PageHero';
import Pagination from '../components/ui/Pagination';
import Section from '../components/ui/Section';
import { useMovieCollection } from '../hooks/useMovieCollection';

const SKELETON_COUNT = 10;

interface MovieCollectionPageProps {
  title: string;
  description?: string;
  eyebrow?: string;
  endpoint: MovieCollectionEndpoint;
  toolbar?: ReactNode;
}

const MovieCollectionPage = ({
  title,
  description,
  eyebrow,
  endpoint,
  toolbar,
}: MovieCollectionPageProps) => {
  const [page, setPage] = useState(1);
  const { movies, loading, error, refetch, totalPages, totalResults } = useMovieCollection(
    endpoint,
    page
  );

  useEffect(() => {
    setPage(1);
  }, [endpoint]);

  const countLabel =
    !loading && !error && totalResults > 0
      ? `${totalResults.toLocaleString()} ${totalResults === 1 ? 'movie' : 'movies'}`
      : undefined;

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      <PageHero eyebrow={eyebrow} title={title} description={description} />

      <Section title="Results" subtitle={countLabel}>
        {toolbar && <div className="mb-6">{toolbar}</div>}

        {loading ? (
          <MovieGridSkeleton columns={5} count={SKELETON_COUNT} />
        ) : error ? (
          <ErrorState
            title={`Unable to load ${title.toLowerCase()} movies`}
            description={`We could not fetch ${title.toLowerCase()} movies right now. Please try again.`}
            onRetry={refetch}
          />
        ) : movies.length === 0 ? (
          <EmptyState
            title="No movies found"
            description={`We could not find any ${title.toLowerCase()} movies right now.`}
          />
        ) : (
          <>
            <MovieGrid columns={5}>
              {movies.map((movie) => (
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

export default MovieCollectionPage;
