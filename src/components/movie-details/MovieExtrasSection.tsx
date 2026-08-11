import type { EntityId } from "../../types/common";
import type { MovieDetails } from "../../types/movie";
import ProductionCompaniesSection from "./ProductionCompaniesSection";
import SpokenLanguagesSection from "./SpokenLanguagesSection";
import TrailerSection from "./TrailerSection";

interface MovieExtrasSectionProps {
  movieId?: EntityId;
  movie: MovieDetails | null;
}

const MovieExtrasSection = ({ movieId, movie }: MovieExtrasSectionProps) => (
  <div className="grid gap-12 sm:gap-16 lg:grid-cols-3 lg:gap-8">
    <div id="trailer" className="scroll-mt-20 lg:col-span-1">
      <TrailerSection movieId={movieId} />
    </div>
    <div className="flex flex-col gap-12 sm:gap-16 lg:gap-8">
      <ProductionCompaniesSection movie={movie} />
    </div>
    <div className="flex flex-col gap-12 sm:gap-16 lg:gap-8">
      <SpokenLanguagesSection movie={movie} />
    </div>
  </div>
);

export default MovieExtrasSection;
