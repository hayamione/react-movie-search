import type { PropsWithChildren } from 'react';
import Container from '../components/ui/Container';
import Footer from './Footer';
import Header from './Header';

const MainLayout = ({ children }: PropsWithChildren) => (
  <div className="flex min-h-screen flex-col">
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent"
    >
      Skip to content
    </a>
    <Header />
    <main id="main-content" className="flex-1">
      <Container className="py-8 sm:py-12 lg:py-16">{children}</Container>
    </main>
    <Footer />
  </div>
);

export default MainLayout;
