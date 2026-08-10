interface RatingBadgeProps {
  rating?: number;
  className?: string;
}

const ratingTone = (rating: number) => {
  if (rating >= 7) return 'bg-emerald-500/15 text-emerald-400';
  if (rating >= 5) return 'bg-amber-500/15 text-amber-400';
  return 'bg-rose-500/15 text-rose-400';
};

const StarIcon = () => (
  <svg
    className="h-3.5 w-3.5 fill-current"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const RatingBadge = ({ rating, className = '' }: RatingBadgeProps) => {
  if (rating === undefined || Number.isNaN(rating)) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-sm font-semibold ${ratingTone(rating)} ${className}`}
    >
      <StarIcon />
      {rating.toFixed(1)}
    </span>
  );
};

export default RatingBadge;
