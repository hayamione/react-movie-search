import { useState } from 'react';
import GenreChip from '../components/ui/GenreChip';
import MovieCollectionPage from './MovieCollectionPage';

type SwitchableEndpoint = 'popular' | 'trending' | 'topRated' | 'upcoming';

const CATEGORIES: { label: string; endpoint: SwitchableEndpoint }[] = [
  { label: 'Popular', endpoint: 'popular' },
  { label: 'Trending', endpoint: 'trending' },
  { label: 'Top Rated', endpoint: 'topRated' },
  { label: 'Upcoming', endpoint: 'upcoming' },
];

const CATEGORY_COPY: Record<SwitchableEndpoint, { title: string; description: string }> = {
  popular: {
    title: 'Popular Movies',
    description: 'What everyone is watching right now.',
  },
  trending: {
    title: 'Trending Movies',
    description: 'The hottest movies right now.',
  },
  topRated: {
    title: 'Top Rated Movies',
    description: 'The best of the best, as voted by audiences worldwide.',
  },
  upcoming: {
    title: 'Upcoming Movies',
    description: 'Coming soon to theaters near you.',
  },
};

const MoviesPage = () => {
  const [endpoint, setEndpoint] = useState<SwitchableEndpoint>('popular');
  const { title, description } = CATEGORY_COPY[endpoint];

  return (
    <MovieCollectionPage
      key={endpoint}
      title={title}
      description={description}
      eyebrow="Movies"
      endpoint={endpoint}
      toolbar={
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <GenreChip
              key={category.endpoint}
              label={category.label}
              active={endpoint === category.endpoint}
              onClick={() => setEndpoint(category.endpoint)}
            />
          ))}
        </div>
      }
    />
  );
};

export default MoviesPage;
