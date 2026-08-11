import type { ReactNode } from 'react';

interface InfoCardProps {
  label: string;
  value: ReactNode;
  className?: string;
}

const InfoCard = ({ label, value, className = '' }: InfoCardProps) => (
  <div className={`rounded-2xl border border-slate-800 bg-slate-900 p-4 ${className}`}>
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
    <p className="mt-1.5 text-sm font-medium text-slate-100">{value}</p>
  </div>
);

export default InfoCard;