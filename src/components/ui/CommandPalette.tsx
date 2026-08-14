import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../../types/movie';
import { searchMovies } from '../../services/api/search.service';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchIcon = () => (
  <svg
    className="h-5 w-5 text-slate-400"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilmIcon = () => (
  <svg
    className="h-4 w-4 text-slate-400"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="17" x2="7" y2="17" />
    <line x1="17" y1="17" x2="22" y2="17" />
    <line x1="17" y1="7" x2="22" y2="7" />
  </svg>
);

const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const controller = new AbortController();
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const response = await searchMovies(trimmed, { signal: controller.signal });
        if (!controller.signal.aborted) {
          setResults(response.movies.slice(0, 8)); // top 8 results
          setSelectedIndex(0);
        }
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        navigate(`/movie/${results[selectedIndex].id}`);
        onClose();
      } else if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 p-4 pt-16 backdrop-blur-sm sm:pt-24 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-overlay animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-slate-800 px-4 py-3.5">
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search movies (e.g. Harry, Inception)..."
            className="w-full bg-transparent pl-3 pr-4 text-base text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          )}
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim().length >= 2 && results.length === 0 && !loading ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No movies found for &ldquo;{query}&rdquo;
            </div>
          ) : results.length > 0 ? (
            <ul ref={listRef} className="flex flex-col gap-1">
              {results.map((movie, index) => {
                const year = movie.releaseDate?.slice(0, 4);
                const isSelected = index === selectedIndex;
                return (
                  <li key={movie.id}>
                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/movie/${movie.id}`);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        isSelected
                          ? 'bg-accent/15 text-accent'
                          : 'text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      {movie.posterSrc ? (
                        <img
                          src={movie.posterSrc}
                          alt=""
                          className="h-10 w-8 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                          <FilmIcon />
                        </div>
                      )}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-semibold">{movie.title}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          {year && <span>{year}</span>}
                          {movie.voteAverage !== undefined && movie.voteAverage > 0 && (
                            <>
                              <span>·</span>
                              <span>★ {movie.voteAverage.toFixed(1)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-6 text-center text-xs text-slate-500">
              Type at least 2 characters to search movies instantly
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-slate-300">↑</kbd>{' '}
              <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-slate-300">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-slate-300">esc</kbd> to close
            </span>
          </div>
          <span>
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-slate-300">↵</kbd> to select
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
