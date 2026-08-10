import Container from './Container';

const NAV_PLACEHOLDERS = ['Link 1', 'Link 2', 'Link 3'];
const SOCIAL_PLACEHOLDERS = ['Twitter', 'GitHub', 'Instagram'];

const linkClass =
  'text-sm text-slate-300 transition-colors duration-fast hover:text-accent focus-visible:text-accent';

const Footer = () => (
  <footer className="border-t border-slate-800 bg-slate-900/60">
    <Container className="py-10 sm:py-12">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </h2>
          <nav aria-label="Footer" className="mt-4">
            <ul className="space-y-2">
              {NAV_PLACEHOLDERS.map((label) => (
                <li key={label}>
                  <a href="#" className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Follow Us
          </h2>
          <ul className="mt-4 space-y-2">
            {SOCIAL_PLACEHOLDERS.map((label) => (
              <li key={label}>
                <a href="#" className={linkClass}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Attribution
          </h2>
          <p className="mt-4 text-sm text-slate-400">
            Data provided by a third-party API. Credit details to be added.
          </p>
        </section>
      </div>

      <div className="mt-10 border-t border-slate-800 pt-6">
        <p className="text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} Movie Search. All rights reserved.
        </p>
      </div>
    </Container>
  </footer>
);

export default Footer;
