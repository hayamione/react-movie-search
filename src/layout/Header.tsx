import Container from '../components/ui/Container';

const Header = () => (
  <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
    <Container className="flex h-16 items-center sm:h-20">
      <span className="text-lg font-bold tracking-tight text-slate-100">
        Movie<span className="text-accent">Search</span>
      </span>
    </Container>
  </header>
);

export default Header;
