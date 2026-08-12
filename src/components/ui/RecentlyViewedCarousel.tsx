import { useRecentlyViewed } from '../../recently-viewed/RecentlyViewedContext';
import MovieCarousel from './MovieCarousel';
import Section from './Section';

const RecentlyViewedCarousel = () => {
  const { recentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <Section title="Recently Viewed" subtitle="Continue watching where you left off.">
      <MovieCarousel movies={recentlyViewed} />
    </Section>
  );
};

export default RecentlyViewedCarousel;