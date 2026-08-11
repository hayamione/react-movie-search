import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import { NAV_ITEMS } from '../constants/navigation';

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

const ThemeTogglePlaceholder = () => (
  <Button variant="ghost" size="sm" aria-label="Toggle theme">
    <SunIcon />
  </Button>
);

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
          <ThemeTogglePlaceholder />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <ThemeTogglePlaceholder />
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
