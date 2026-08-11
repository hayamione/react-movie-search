import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
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
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppLayout />
      </BrowserRouter>
    </React.StrictMode>
  );
}
