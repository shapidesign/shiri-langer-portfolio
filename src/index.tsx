import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import './styles/performance.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PortfolioDataProvider } from './context/PortfolioDataContext';
import AdminModule from './admin/AdminModule';

import { initSupabaseClient } from './lib/supabaseClient';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

void initSupabaseClient().finally(() => {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <PortfolioDataProvider>
          <Routes>
            <Route path="/admin/*" element={<AdminModule />} />
            <Route path="*" element={<App />} />
          </Routes>
        </PortfolioDataProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
});

reportWebVitals();
