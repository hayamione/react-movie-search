import { useState } from 'react';
import type { ProductionCompany } from '../../types/movie';

interface CompanyCardProps {
  company: ProductionCompany;
  className?: string;
}

const initials = (name: string) => {
  const words = name.split(/\s+/).filter(Boolean);
  const letters = words.length > 1
    ? `${words[0][0]}${words[1][0]}`
    : words[0]?.slice(0, 2);
  return (letters ?? '?').toUpperCase();
};

const CompanyCard = ({ company, className = '' }: CompanyCardProps) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(company.logoSrc) && !logoFailed;

  return (
    <div
      className={`flex h-full flex-col items-start justify-end gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 ${className}`}
    >
      <div className="flex h-12 w-28 shrink-0 items-center justify-center">
        {showLogo ? (
          <img
            src={company.logoSrc}
            alt={company.name}
            loading="lazy"
            decoding="async"
            onError={() => setLogoFailed(true)}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-base font-bold text-slate-400"
          >
            {initials(company.name)}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-slate-100">{company.name}</h3>
        {company.originCountry && (
          <p className="mt-0.5 text-xs uppercase tracking-wider text-slate-500">
            {company.originCountry}
          </p>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;