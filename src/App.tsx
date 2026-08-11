import { Route, Routes, useParams } from 'react-router-dom';
import FavoritesPage from './pages/FavoritesPage';
import GenrePage from './pages/GenrePage';
import GenresPage from './pages/GenresPage';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetails/MovieDetailsPage';
import MoviesPage from './pages/MoviesPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchPage from './pages/SearchPage';
import TopRatedPage from './pages/TopRatedPage';
import TrendingPage from './pages/TrendingPage';
import UpcomingPage from './pages/UpcomingPage';

const GenreRoute = () => {
  const { id } = useParams();
  return <GenrePage genreId={Number(id)} />;
};

const MovieRoute = () => {
  const { id } = useParams();
  return <MovieDetailsPage movieId={Number(id)} />;
};

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/movies" element={<MoviesPage />} />
    <Route path="/genres" element={<GenresPage />} />
    <Route path="/genre/:id" element={<GenreRoute />} />
    <Route path="/trending" element={<TrendingPage />} />
    <Route path="/top-rated" element={<TopRatedPage />} />
    <Route path="/upcoming" element={<UpcomingPage />} />
    <Route path="/favorites" element={<FavoritesPage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/movie/:id" element={<MovieRoute />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;