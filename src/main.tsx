import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppLayout from './layout/AppLayout';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <AppLayout />
    </React.StrictMode>
  );
}
