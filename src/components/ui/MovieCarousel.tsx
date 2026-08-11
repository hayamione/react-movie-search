import type { Movie } from '../../types/movie';
import MovieCard from '../MovieCard';
import Carousel from './Carousel';

interface MovieCarouselProps {
  movies: Movie[];
  cardClassName?: string;
  className?: string;
}

const MovieCarousel = ({
  movies,
  cardClassName = 'w-40 shrink-0 sm:w-48',
  className = '',
}: MovieCarouselProps) => (
  <Carousel className={className}>
    {movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} className={cardClassName} />
    ))}
  </Carousel>
);

export default MovieCarousel;