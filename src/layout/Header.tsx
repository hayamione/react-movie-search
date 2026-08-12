import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import { NAV_ITEMS } from '../constants/navigation';
import { useTheme } from '../theme/ThemeContext';

const linkClasses = (active: boolean) =>
  `rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-fast ${
    active
      ? 'bg-slate-800/70 text-slate-50'
      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-100'
  }`;

const MenuIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const SunIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const SystemIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

const ThemeSelector = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const currentIcon =
    theme === 'light' ? (
      <SunIcon />
    ) : theme === 'dark' ? (
      <MoonIcon />
    ) : resolvedTheme === 'dark' ? (
      <MoonIcon />
    ) : (
      <SunIcon />
    );

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle theme menu"
        aria-expanded={menuOpen}
        className="gap-2"
      >
        {currentIcon}
        <span className="hidden text-xs capitalize text-slate-400 md:inline">{theme}</span>
      </Button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-raised z-50">
          <button
            type="button"
            onClick={() => {
              setTheme('light');
              setMenuOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
              theme === 'light'
                ? 'bg-accent/15 text-accent font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <SunIcon />
            <span>Light</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTheme('dark');
              setMenuOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-accent/15 text-accent font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <MoonIcon />
            <span>Dark</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTheme('system');
              setMenuOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
              theme === 'system'
                ? 'bg-accent/15 text-accent font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <SystemIcon />
            <span>System</span>
          </button>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      const firstLink = menuRef.current?.querySelector<HTMLAnchorElement>('a');
      firstLink?.focus();
    } else if (wasOpenRef.current) {
      toggleRef.current?.focus();
    }
    wasOpenRef.current = open;
  }, [open]);

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      close();
      return;
    }

    if (event.key === 'Tab' && open) {
      const focusable = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>('a[href]') ?? []
      );
      if (focusable.length === 0) {
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <Container className="flex h-16 items-center gap-4 sm:h-20">
        <NavLink to="/" end className="text-lg font-bold tracking-tight text-slate-100">
          Movie<span className="text-accent">Search</span>
        </NavLink>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => linkClasses(isActive)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <ThemeSelector />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <ThemeSelector />
          <Button
            ref={toggleRef}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </Button>
        </div>
      </Container>

      <div
        ref={menuRef}
        id={menuId}
        onKeyDown={handleMenuKeyDown}
        aria-hidden={!open}
        className={`origin-top transition-all duration-smooth lg:hidden absolute right-0 left-0 border-slate-800 bg-slate-950/90 backdrop-blur-md ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
        }`}
      >
        <Container className="pb-4">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                tabIndex={open ? 0 : -1}
                onClick={close}
                className={({ isActive }) => linkClasses(isActive)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </Container>
      </div>
    </header>
  );
};

export default Header;
