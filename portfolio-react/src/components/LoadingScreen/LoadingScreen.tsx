import React, { useState, useEffect } from 'react';
import { LoadingManager } from '../../managers/LoadingManager';
import { ThreeDot } from 'react-loading-indicators';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [isComplete, setIsComplete] = useState(false);
  const loadingManager = LoadingManager.getInstance();

  useEffect(() => {
    // Check if loading is complete
    const progressInterval = setInterval(() => {
      if (loadingManager.isAllLoaded()) {
        clearInterval(progressInterval);
        
        // Wait a bit to show completion, then fade out
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(() => {
            onLoadingComplete();
          }, 500); // Fade out delay
        }, 300);
      }
    }, 100);

    // Cleanup
    return () => {
      clearInterval(progressInterval);
    };
  }, [onLoadingComplete]);

  return (
    <div className={`loading-screen ${isComplete ? 'fade-out' : ''}`}>
      <div className="loading-container">
        <div className="loading-text">
          <h2>Loading Portfolio</h2>
          <p>Preparing your experience...</p>
          
          {/* ThreeDot Effect */}
          <div className="loading-indicator-container">
            <ThreeDot
              color="#4DD8FF"
              size="medium"
              text=""
              textColor=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
