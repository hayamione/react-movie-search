import type { Credit } from '../../types/credit';
import EmptyState from '../ui/EmptyState';
import InfoCard from '../ui/InfoCard';
import Section from '../ui/Section';

interface CrewGroup {
  label: string;
  jobs: string[];
}

const CREW_GROUPS: CrewGroup[] = [
  { label: 'Director', jobs: ['Director'] },
  {
    label: 'Writers',
    jobs: ['Writer', 'Screenplay', 'Story', 'Novel', 'Teleplay', 'Theatre Play'],
  },
  { label: 'Producers', jobs: ['Producer', 'Executive Producer'] },
  { label: 'Music', jobs: ['Original Music Composer', 'Music'] },
];

const matchesJob = (jobs: string[]) => (person: Credit) =>
  Boolean(person.job) && jobs.includes(person.job!);

const uniqueNames = (people: Credit[]) => {
  const seen = new Set<string>();
  return people.filter((person) => {
    if (seen.has(person.name)) {
      return false;
    }
    seen.add(person.name);
    return true;
  });
};

interface CrewSectionProps {
  crew: Credit[];
}

const CrewSection = ({ crew }: CrewSectionProps) => {
  const groups = CREW_GROUPS.map(({ label, jobs }) => ({
    label,
    people: uniqueNames(crew.filter(matchesJob(jobs))),
  })).filter((group) => group.people.length > 0);

  if (groups.length === 0) {
    return (
      <Section title="Crew" subtitle="The people behind the scenes.">
        <EmptyState title="No crew available" description="Crew data could not be found for this movie." />
      </Section>
    );
  }

  return (
    <Section title="Crew" subtitle="The people behind the scenes.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group) => (
          <InfoCard
            key={group.label}
            label={group.label}
            value={group.people.map((person) => person.name).join(', ')}
          />
        ))}
      </div>
    </Section>
  );
};

export default CrewSection;