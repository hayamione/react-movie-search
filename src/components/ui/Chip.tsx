interface ChipProps {
  label: string;
  className?: string;
}

const Chip = ({ label, className = '' }: ChipProps) => (
  <span
    className={`inline-flex items-center rounded-xl bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-300 ${className}`}
  >
    {label}
  </span>
);

export default Chip;