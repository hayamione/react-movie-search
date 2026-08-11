import GenrePage from './pages/GenrePage';
import GenresPage from './pages/GenresPage';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import SearchPage from './pages/SearchPage';
import TopRatedPage from './pages/TopRatedPage';
import TrendingPage from './pages/TrendingPage';
import UpcomingPage from './pages/UpcomingPage';

const getRoute = () => {
  const base = import.meta.env.BASE_URL;
  const cleanBase = base === '/' ? '' : base.replace(/\/$/, '');
  const path = window.location.pathname;
  return path.startsWith(cleanBase) ? path.slice(cleanBase.length) || '/' : path;
};

const App = () => {
  const route = getRoute();

  if (route === '/genres' || route.startsWith('/genres/')) {
    return <GenresPage />;
  }

  const genreMatch = route.match(/^\/genre\/(\d+)\/?$/);
  if (genreMatch) {
    return <GenrePage genreId={Number(genreMatch[1])} />;
  }

  if (route === '/upcoming' || route.startsWith('/upcoming/')) {
    return <UpcomingPage />;
  }

  if (route === '/movies' || route.startsWith('/movies/')) {
    return <MoviesPage />;
  }

  if (route === '/top-rated' || route.startsWith('/top-rated/')) {
    return <TopRatedPage />;
  }

  if (route === '/trending' || route.startsWith('/trending/')) {
    return <TrendingPage />;
  }

  if (route === '/search' || route.startsWith('/search/')) {
    return <SearchPage />;
  }

  return <HomePage />;
};

export default App;
