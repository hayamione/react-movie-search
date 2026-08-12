import { Heart } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { Movie } from '../../types/movie';
import { useFavorites } from '../../favorites/FavoritesContext';
import Button from './Button';

interface FavoriteButtonProps {
  movie: Movie;
  variant?: 'inline' | 'card';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FavoriteButton = ({
  movie,
  variant = 'inline',
  size = 'md',
  className = '',
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);

  const handleCardClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(movie);
  };

  if (variant === 'card') {
    const label = favorite
      ? `Remove ${movie.title} from favorites`
      : `Add ${movie.title} to favorites`;

    return (
      <button
        type="button"
        onClick={handleCardClick}
        aria-pressed={favorite}
        aria-label={label}
        title={label}
        className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-soft backdrop-blur-md transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
          favorite
            ? 'border-amber-500/60 bg-amber-500/90 text-slate-950'
            : 'border-slate-700 bg-slate-950/70 text-slate-200 hover:border-slate-500 hover:text-slate-50'
        } ${className}`}
      >
        <Heart className="h-4 w-4" fill={favorite ? 'currentColor' : 'none'} aria-hidden="true" />
      </button>
    );
  }

  return (
    <Button
      variant={favorite ? 'primary' : 'secondary'}
      size={size}
      aria-pressed={favorite}
      onClick={() => toggleFavorite(movie)}
      className={className}
    >
      <Heart className="h-4 w-4" fill={favorite ? 'currentColor' : 'none'} aria-hidden="true" />
      {favorite ? 'Favorited' : 'Add to favorites'}
    </Button>
  );
};

export default FavoriteButton;