import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../lib/tailwind.css';
import { ThemeProvider } from '../lib';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
