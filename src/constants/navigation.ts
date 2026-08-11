export interface NavItem {
  label: string;
  to: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Movies', to: '/movies' },
  { label: 'Genres', to: '/genres' },
  { label: 'Trending', to: '/trending' },
  { label: 'Top Rated', to: '/top-rated' },
  { label: 'Upcoming', to: '/upcoming' },
  { label: 'Favorites', to: '/favorites' },
  { label: 'Search', to: '/search' },
];