import React, { useState, useEffect } from 'react';
import ThreeDot from '../ThreeDot/ThreeDot';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const loadingSteps = [
      { progress: 20, delay: 300 },
      { progress: 40, delay: 400 },
      { progress: 60, delay: 500 },
      { progress: 80, delay: 600 },
      { progress: 95, delay: 700 },
      { progress: 100, delay: 800 }
    ];

    let currentStep = 0;
    const timeouts: NodeJS.Timeout[] = [];

    const updateProgress = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        timeouts.push(
          setTimeout(() => {
            setProgress(step.progress);
            currentStep++;
            updateProgress();
          }, step.delay)
        );
      } else {
        // Loading complete
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(() => {
            onLoadingComplete();
          }, 500); // Fade out delay
        }, 300);
      }
    };

    updateProgress();

    // Cleanup timeouts
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [onLoadingComplete]);

  return (
    <div className={`loading-screen ${isComplete ? 'fade-out' : ''}`}>
      <div className="loading-container">
        <ThreeDot
          variant="pulsate"
          color="#E3FF00"
          size="medium"
          text=""
          textColor=""
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
