import { useEffect, useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

const FALLBACK_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%230f172a'/%3E%3Cg fill='none' stroke='%23334155' stroke-width='6'%3E%3Crect x='40' y='55' width='120' height='175' rx='8'/%3E%3Ccircle cx='88' cy='105' r='11'/%3E%3Cpath d='M40 185l32-26 26 22 24-18 38 32v17H40z'/%3E%3C/g%3E%3C/svg%3E";

interface PosterProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'onLoad' | 'onError'> {
  src?: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
}

const Poster = ({
  src,
  alt,
  fallbackSrc = FALLBACK_POSTER,
  className = '',
  ...rest
}: PosterProps) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [src]);

  const currentSrc = !src || errored ? fallbackSrc : src;

  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden rounded-xl bg-slate-900 transition-shadow duration-smooth hover:shadow-raised ${className}`}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-slate-800" aria-hidden="true" />
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className="h-full w-full object-cover transition-transform duration-smooth hover:scale-[1.02]"
        {...rest}
      />
    </div>
  );
};

export default Poster;
