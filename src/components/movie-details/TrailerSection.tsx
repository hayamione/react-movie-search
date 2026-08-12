import type { EntityId } from '../../types/common';
import type { MovieVideo } from '../../types/video';
import { useMovieVideos } from '../../hooks/useMovieVideos';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import Section from '../ui/Section';
import Skeleton from '../ui/Skeleton';

const trailerEligible = (video: MovieVideo) =>
  video.site?.toLowerCase() === 'youtube' && video.type === 'Trailer';

const pickTrailer = (videos: MovieVideo[]): MovieVideo | undefined =>
  videos.find(trailerEligible) ?? videos.find((video) => video.site?.toLowerCase() === 'youtube');

interface TrailerSectionProps {
  movieId?: EntityId;
}

const TrailerSection = ({ movieId }: TrailerSectionProps) => {
  const { data: videos, loading, error, refetch } = useMovieVideos(movieId);

  if (loading) {
    return (
      <Section title="Trailer" subtitle="Watch the official trailer.">
        <Skeleton className="aspect-video w-full rounded-2xl" />
      </Section>
    );
  }

  if (error) {
    return (
      <Section title="Trailer" subtitle="Watch the official trailer.">
        <ErrorState
          title="Unable to load the trailer"
          description="We could not fetch the trailer for this movie. Please try again."
          onRetry={refetch}
        />
      </Section>
    );
  }

  const trailer = pickTrailer(videos ?? []);

  if (!trailer) {
    return (
      <Section title="Trailer" subtitle="Watch the official trailer.">
        <EmptyState
          title="No trailer available"
          description="We could not find an official trailer for this movie."
        />
      </Section>
    );
  }

  return (
    <Section title="Trailer" subtitle="Watch the official trailer.">
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title={trailer.name || 'Movie trailer'}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </Section>
  );
};

export default TrailerSection;