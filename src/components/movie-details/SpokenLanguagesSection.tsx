import type { MovieDetails } from '../../types/movie';
import Chip from '../ui/Chip';
import EmptyState from '../ui/EmptyState';
import Section from '../ui/Section';

interface SpokenLanguagesSectionProps {
  movie: MovieDetails | null;
}

const SpokenLanguagesSection = ({ movie }: SpokenLanguagesSectionProps) => {
  const languages = movie?.spokenLanguages ?? [];

  if (!movie) {
    return null;
  }

  return (
    <Section title="Spoken Languages" subtitle="Languages featured in the movie.">
      {languages.length === 0 ? (
        <EmptyState
          title="No spoken languages available"
          description="Spoken language data could not be found for this movie."
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          {languages.map((language) => (
            <Chip key={language.code} label={language.name} />
          ))}
        </div>
      )}
    </Section>
  );
};

export default SpokenLanguagesSection;