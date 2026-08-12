import { useNavigate } from 'react-router-dom';
import { BookmarkPlus } from 'lucide-react';
import { useFavorites } from '../favorites/FavoritesContext';
import MovieCard from '../components/MovieCard';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import MovieGrid from '../components/ui/MovieGrid';
import Section from '../components/ui/Section';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  return (
    <Section
      title="Favorites"
      subtitle={
        favorites.length > 0
          ? `${favorites.length} ${favorites.length === 1 ? 'movie' : 'movies'} saved.`
          : 'Movies you have saved.'
      }
    >
      {favorites.length === 0 ? (
        <EmptyState
          icon={<BookmarkPlus className="h-8 w-8" aria-hidden="true" strokeWidth={1.75} />}
          title="No favorites yet"
          description="Save movies to build your personal watchlist."
          action={<Button onClick={() => navigate('/movies')}>Browse Movies</Button>}
        />
      ) : (
        <MovieGrid columns={5}>
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </MovieGrid>
      )}
    </Section>
  );
};

export default FavoritesPage;