import type { MovieDetails } from '../../types/movie';
import Section from '../ui/Section';
import ProviderCard from './ProviderCard';

interface WhereToWatchSectionProps {
  movie: MovieDetails | null;
}

const WhereToWatchSection = ({ movie }: WhereToWatchSectionProps) => {
  const watchProviders = movie?.watchProviders;

  if (!watchProviders || watchProviders.providers.length === 0) {
    return null;
  }

  return (
    <Section
      title="Where to Watch"
      subtitle="Streaming, rent, and purchase options available for this movie."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {watchProviders.providers.map((provider) => (
          <ProviderCard key={`${provider.id}-${provider.type}`} provider={provider} />
        ))}
      </div>
    </Section>
  );
};

export default WhereToWatchSection;
