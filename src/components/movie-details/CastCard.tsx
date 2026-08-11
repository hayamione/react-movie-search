import type { Credit } from '../../types/credit';
import Poster from '../ui/Poster';

const PERSON_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%230f172a'/%3E%3Cg fill='none' stroke='%23334155' stroke-width='6'%3E%3Ccircle cx='100' cy='115' r='38'/%3E%3Cpath d='M52 258c8-46 28-70 48-70s40 24 48 70z'/%3E%3C/g%3E%3C/svg%3E";

interface CastCardProps {
  person: Credit;
  className?: string;
}

const CastCard = ({ person, className = '' }: CastCardProps) => (
  <article
    className={`w-36 shrink-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 sm:w-40 ${className}`}
  >
    <Poster src={person.profileSrc} alt={person.name} fallbackSrc={PERSON_FALLBACK} />
    <div className="flex flex-col gap-1 p-3">
      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-100">
        {person.name}
      </h3>
      {person.character && (
        <p className="line-clamp-2 text-xs leading-snug text-slate-400">{person.character}</p>
      )}
    </div>
  </article>
);

export default CastCard;