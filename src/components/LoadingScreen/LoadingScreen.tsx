import React, { useState, useEffect } from 'react';
import ThreeDot from '../ThreeDot/ThreeDot';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate loading time then fade out
    const loadingTimeout = setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => {
        onLoadingComplete();
      }, 500); // Fade out delay
    }, 2000); // Show loading animation for 2 seconds

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [onLoadingComplete]);

  return (
    <div className={`loading-screen ${isComplete ? 'fade-out' : ''}`}>
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
      </div>
    </div>
  );
};

export default LoadingScreen;
