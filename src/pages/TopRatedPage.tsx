import MovieCollectionPage from './MovieCollectionPage';

const TopRatedPage = () => (
  <MovieCollectionPage
    title="Top Rated"
    description="The best of the best, as voted by audiences worldwide."
    endpoint="topRated"
  />
);

export default TopRatedPage;
