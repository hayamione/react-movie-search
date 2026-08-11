import { Link } from 'react-router-dom';

interface GenreChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}

const baseChipStyles =
  'inline-flex items-center rounded-xl px-3 py-1.5 text-sm font-medium transition-colors duration-fast';
const inactiveStyles = 'bg-slate-800 text-slate-300 hover:bg-slate-700';
const activeStyles = 'bg-accent text-slate-950 hover:bg-accent-400';
const interactiveStyles =
  'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

const GenreChip = ({ label, active = false, onClick, href, className = '' }: GenreChipProps) => {
  const chipStyles = `${baseChipStyles} ${active ? activeStyles : inactiveStyles} ${
    onClick || href ? interactiveStyles : ''
  } ${className}`;

  if (href) {
    return (
      <Link to={href} aria-current={active ? 'page' : undefined} className={chipStyles}>
        {label}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={active} className={chipStyles}>
        {label}
      </button>
    );
  }

  return <span className={chipStyles}>{label}</span>;
};

export default GenreChip;
