import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';

const getRoute = () => {
  const base = import.meta.env.BASE_URL;
  const cleanBase = base === '/' ? '' : base.replace(/\/$/, '');
  const path = window.location.pathname;
  return path.startsWith(cleanBase) ? path.slice(cleanBase.length) || '/' : path;
};

const App = () => {
  const route = getRoute();

  if (route === '/search' || route.startsWith('/search/')) {
    return <SearchPage />;
  }

  return <HomePage />;
};

export default App;
