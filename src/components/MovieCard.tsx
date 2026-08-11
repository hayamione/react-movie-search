import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie';
import GenreChip from './ui/GenreChip';
import Poster from './ui/Poster';
import RatingBadge from './ui/RatingBadge';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
  className?: string;
}

const cardStyles =
  'group flex h-full flex-col overflow-hidden rounded-2xl bg-slate-900 shadow-soft transition-all duration-smooth hover:-translate-y-1 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 cursor-pointer';

const MovieCard = ({ movie, onClick, className = '' }: MovieCardProps) => {
  const releaseYear = movie.releaseDate?.slice(0, 4);

  const content = (
    <>
      <Poster src={movie.posterSrc} alt={movie.title} />
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-balance font-semibold leading-snug text-slate-100">
          {movie.title}
        </h3>
        <div className="mt-1 flex items-center justify-between gap-3">
          <span className="text-sm text-slate-400">{releaseYear}</span>
          <RatingBadge rating={movie.voteAverage} />
        </div>
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <GenreChip key={genre.id} label={genre.name} />
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${cardStyles} w-full text-start ${className}`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link to={`/movie/${movie.id}`} className={`${cardStyles} ${className}`}>
      {content}
    </Link>
  );
};

export default MovieCard;
