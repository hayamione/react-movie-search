import type { MovieDetails } from '../../types/movie';
import CompanyCard from '../ui/CompanyCard';
import EmptyState from '../ui/EmptyState';
import Section from '../ui/Section';

interface ProductionCompaniesSectionProps {
  movie: MovieDetails | null;
}

const ProductionCompaniesSection = ({ movie }: ProductionCompaniesSectionProps) => {
  const companies = movie?.productionCompanies ?? [];

  if (!movie) {
    return null;
  }

  return (
    <Section title="Production Companies" subtitle="The studios behind the movie.">
      {companies.length === 0 ? (
        <EmptyState
          title="No production companies available"
          description="Production company data could not be found for this movie."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </Section>
  );
};

export default ProductionCompaniesSection;