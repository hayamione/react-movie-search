import { useNavigate } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16 sm:gap-10 sm:py-24">
      <h1 className="text-center text-7xl font-extrabold leading-none tracking-tight text-accent sm:text-8xl lg:text-9xl">
        404
      </h1>
      <EmptyState
        icon={<Clapperboard className="h-8 w-8" aria-hidden="true" strokeWidth={1.75} />}
        title="Page not found"
        description="Looks like this movie never made it to our database."
        className="w-full max-w-xl"
        action={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => navigate('/')}>Return Home</Button>
            <Button variant="secondary" onClick={() => navigate('/movies')}>
              Browse Movies
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default NotFoundPage;