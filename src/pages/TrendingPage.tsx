import MovieCollectionPage from './MovieCollectionPage';

const TrendingPage = () => (
  <MovieCollectionPage
    title="Trending"
    description="The hottest movies right now."
    endpoint="trending"
  />
);

export default TrendingPage;
