import EmptyState from '../components/ui/EmptyState';
import Section from '../components/ui/Section';

const FavoritesPage = () => (
  <Section title="Favorites" subtitle="Movies you have saved.">
    <EmptyState
      title="No favorites yet"
      description="Movies you save to your watchlist will appear here."
    />
  </Section>
);

export default FavoritesPage;