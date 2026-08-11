import type { PropsWithChildren } from 'react';

interface CarouselProps extends PropsWithChildren {
  className?: string;
}

const Carousel = ({ children, className = '' }: CarouselProps) => (
  <div
    className={`-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 ${className}`}
  >
    {children}
  </div>
);

export default Carousel;