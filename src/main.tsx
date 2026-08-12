import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { FavoritesProvider } from './favorites/FavoritesContext';
import { RecentlyViewedProvider } from './recently-viewed/RecentlyViewedContext';
import { ThemeProvider } from './theme/ThemeContext';
import AppLayout from './layout/AppLayout';

const savedRedirect = sessionStorage.getItem('gh:redirect');
if (savedRedirect) {
  sessionStorage.removeItem('gh:redirect');
  history.replaceState(null, '', savedRedirect);
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <FavoritesProvider>
            <RecentlyViewedProvider>
              <ThemeProvider>
                <AppLayout />
              </ThemeProvider>
            </RecentlyViewedProvider>
          </FavoritesProvider>
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
}
