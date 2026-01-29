import React from 'react';
import ThreeDot from '../ThreeDot/ThreeDot';
import './LoadingScreen.css';

const LoadingScreen: React.FC = () => {

  // Listen for parent signaling completion (unmounting will happen via parent)
  // But actually, the parent unmounts this component when loading is done.
  // We want to trigger a fade out animation first?
  // The current architecture in App.tsx is:
  // if (isLoading) return <LoadingScreen />
  // This means unmount is immediate.
  // App.tsx has: if (!isLoading) setTimeout(() => setShowMainApp(true), 500)
  // This handles the MainApp fade in, but LoadingScreen just disappears.
  
  // To handle this properly without changing App.tsx structure too much:
  // The LoadingScreen is purely presentational. The delay should be in useLoading or LoadingManager.

  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="loading-text">
          <h2>Loading Portfolio</h2>
        </div>
        <ThreeDot
          variant="pulsate"
          color="#85B7D8"
          size="medium"
          text=""
          textColor=""
        />
        <div className="loading-affordance" aria-hidden="true">
          <div className="loading-affordance-icon">
            <span className="affordance-cursor" />
            <span className="affordance-arrow" />
          </div>
          <div className="loading-affordance-text">Drag or swipe to explore</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
