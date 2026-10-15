import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/base.css';
import './styles/navbar.css';
import './styles/browse.css';
import './styles/modal.css';
import './styles/pages.css';
import './styles/watch.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
