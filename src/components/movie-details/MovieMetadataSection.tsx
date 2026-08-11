import type { MovieDetails } from '../../types/movie';
import Section from '../ui/Section';
import InfoCard from '../ui/InfoCard';
import {
  formatCurrency,
  formatLanguageCode,
  formatNumber,
  formatPopularity,
  formatReleaseDate,
  formatRuntime,
} from '../../utils/format';

interface MovieMetadataSectionProps {
  movie: MovieDetails | null;
}

const MovieMetadataSection = ({ movie }: MovieMetadataSectionProps) => {
  if (!movie) {
    return null;
  }

  const items = [
    { label: 'Status', value: movie.status },
    { label: 'Original language', value: formatLanguageCode(movie.originalLanguage) },
    { label: 'Budget', value: formatCurrency(movie.budget) },
    { label: 'Revenue', value: formatCurrency(movie.revenue) },
    { label: 'Runtime', value: formatRuntime(movie.runtime) },
    { label: 'Vote count', value: formatNumber(movie.voteCount) },
    { label: 'Popularity', value: formatPopularity(movie.popularity) },
    { label: 'Release date', value: formatReleaseDate(movie.releaseDate) },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  if (items.length === 0) {
    return null;
  }

  return (
    <Section title="At a Glance">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <InfoCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </Section>
  );
};

export default MovieMetadataSection;