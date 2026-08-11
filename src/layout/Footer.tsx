import { Link } from "react-router-dom";
import { FolderGit2, Globe, Film } from "lucide-react";
import { NAV_ITEMS } from "../constants/navigation";
import Chip from "../components/ui/Chip";
import Container from "../components/ui/Container";

const headingClass =
  "text-xs font-semibold uppercase tracking-wider text-slate-400";

const linkClass =
  "text-sm text-slate-400 transition-colors duration-fast hover:text-accent";

const RESOURCES = [
  {
    label: "GitHub Repository",
    href: "https://github.com/hayamione/react-movie-search",
    icon: FolderGit2,
  },
  { label: "Portfolio", href: "https://hayamione.netlify.app", icon: Globe },
  {
    label: "TMDB",
    href: "https://www.themoviedb.org",
    icon: Film,
    note: "Data provided by TMDB",
  },
];

const TECH_CHIPS = [
  "React",
  "TypeScript",
  "Vite",
  "Tailwind CSS",
  "React Router",
  "TMDB API",
];

const Footer = () => (
  <footer className="border-t border-slate-800 bg-slate-900/60">
    <Container className="py-10 sm:py-12">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <section>
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-slate-100"
          >
            Movie<span className="text-accent">Search</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Discover trending, popular, top-rated and upcoming movies through a
            modern movie discovery experience.
          </p>
        </section>

        <section>
          <h2 className={headingClass}>Explore</h2>
          <nav aria-label="Footer" className="mt-4">
            <ul className="grid grid-cols-2 gap-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <section>
          <h2 className={headingClass}>Resources</h2>
          <ul className="mt-4 space-y-2.5">
            {RESOURCES.map(({ label, href, icon: Icon, note }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-fast hover:text-accent"
                >
                  <Icon
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                    strokeWidth={2}
                  />
                  <span>{label}</span>
                  {note && (
                    <span className="text-xs text-slate-500 transition-colors duration-fast group-hover:text-slate-400">
                      {note}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className={headingClass}>Built With</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {TECH_CHIPS.map((label) => (
              <Chip key={label} label={label} />
            ))}
          </div>
        </section>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 sm:mt-12 sm:flex-row">
        <p className="text-sm text-slate-400">&copy; 2026 MovieSearch</p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">
            Designed &amp; Developed by{" "}
            <a href="https://hayamione.netlify.app">
              <span className="font-medium text-slate-200">Haya Zubair</span>
            </a>
          </span>
          <div className="flex items-center gap-1">
            <a
              href="https://hayamione.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio"
              className="rounded-lg p-1.5 text-slate-400 transition-colors duration-fast hover:bg-slate-800 hover:text-accent"
            >
              <Globe className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
            </a>
            <a
              href="https://github.com/hayamione/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded-lg p-1.5 text-slate-400 transition-colors duration-fast hover:bg-slate-800 hover:text-accent"
            >
              <FolderGit2
                className="h-4 w-4"
                aria-hidden="true"
                strokeWidth={2}
              />
            </a>
          </div>
        </div>
      </div>
    </Container>
  </footer>
);

export default Footer;
