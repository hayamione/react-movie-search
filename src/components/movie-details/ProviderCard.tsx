import type { WatchProvider } from '../../types/movie';

interface ProviderCardProps {
  provider: WatchProvider;
}

const ProviderCard = ({ provider }: ProviderCardProps) => {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-soft transition-all duration-fast hover:border-slate-700 hover:bg-slate-900"
      title={`${provider.name} (${provider.type})`}
    >
      {provider.logoSrc ? (
        <img
          src={provider.logoSrc}
          alt={provider.name}
          className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-sm"
          loading="lazy"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-xs font-bold text-slate-400">
          {provider.name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-slate-200">{provider.name}</span>
        <span className="text-xs capitalize text-slate-400">{provider.type}</span>
      </div>
    </div>
  );
};

export default ProviderCard;
