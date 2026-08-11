import type { Credit } from '../../types/credit';
import Carousel from '../ui/Carousel';
import EmptyState from '../ui/EmptyState';
import Section from '../ui/Section';
import CastCard from './CastCard';

interface CastCarouselProps {
  cast: Credit[];
}

const byOrder = (a: Credit, b: Credit) =>
  (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);

const CastCarousel = ({ cast }: CastCarouselProps) => {
  if (cast.length === 0) {
    return (
      <Section title="Cast" subtitle="The actors who brought this story to life.">
        <EmptyState title="No cast available" description="Cast data could not be found for this movie." />
      </Section>
    );
  }

  return (
    <Section title="Cast" subtitle="The actors who brought this story to life.">
      <Carousel>
        {[...cast].sort(byOrder).map((person) => (
          <CastCard key={person.id} person={person} />
        ))}
      </Carousel>
    </Section>
  );
};

export default CastCarousel;