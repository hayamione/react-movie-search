import { useNavigate } from 'react-router-dom';
import { BookmarkPlus } from 'lucide-react';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Section from '../components/ui/Section';

const FavoritesPage = () => {
  const navigate = useNavigate();

  return (
    <Section title="Favorites" subtitle="Movies you have saved.">
      <EmptyState
        icon={<BookmarkPlus className="h-8 w-8" aria-hidden="true" strokeWidth={1.75} />}
        title="No favorites yet"
        description="Save movies to build your personal watchlist."
        action={
          <Button onClick={() => navigate('/movies')}>Browse Movies</Button>
        }
      />
    </Section>
  );
};

export default FavoritesPage;