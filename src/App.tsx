import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import PortfolioGrid from './components/PortfolioGrid';
import BackgroundManager from './components/BackgroundManager';
import LoadingScreen from './components/LoadingScreen';
import { useLoading } from './hooks/useLoading';
import './App.css';

function App() {
  const { isLoading } = useLoading();
  const [showMainApp, setShowMainApp] = useState(false);

  useEffect(() => {
    // Log version for debugging
    console.log('App Version: 2.0.5 - Mobile Fixes & Video Gallery');

    if (!isLoading) {
      // Delay showing main app to allow loading screen to fade out first
      const timer = setTimeout(() => {
        setShowMainApp(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BackgroundManager>
      <div className={`App ${showMainApp ? 'loaded' : ''}`}>
        <PortfolioGrid />
      </div>
      <Analytics />
    </BackgroundManager>
  );
}

export default App;
