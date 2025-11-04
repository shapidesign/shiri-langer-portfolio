import React, { useState, useEffect } from 'react';
import PortfolioGrid from './components/PortfolioGrid';
import BackgroundManager from './components/BackgroundManager';
import VersionTag from './components/VersionTag';
import LoadingScreen from './components/LoadingScreen';
import { useLoading } from './hooks/useLoading';
import { useLenisScroll } from './hooks/useLenisScroll';
import './App.css';

function App() {
  const { isLoading, onLoadingComplete } = useLoading();
  const [showMainApp, setShowMainApp] = useState(false);
  
  // Initialize Lenis smooth scrolling (respects prefers-reduced-motion)
  const { lenisManager } = useLenisScroll(!isLoading);

  useEffect(() => {
    if (!isLoading) {
      // Delay showing main app to allow loading screen to fade out first
      const timer = setTimeout(() => {
        setShowMainApp(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={onLoadingComplete} />;
  }

  return (
    <BackgroundManager>
      <div className={`App ${showMainApp ? 'loaded' : ''}`}>
        <PortfolioGrid />
        <VersionTag />
      </div>
    </BackgroundManager>
  );
}

export default App;
