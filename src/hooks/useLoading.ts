import { useState, useEffect, useCallback } from 'react';
import { LoadingManager } from '../managers/LoadingManager';

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const loadingManager = LoadingManager.getInstance();

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Initialize loading manager
    loadingManager.initialize();

    // Set up loading complete callback
    const onComplete = () => {
        // Add a small buffer to ensure visual stability
        setTimeout(() => {
            handleLoadingComplete();
        }, 500);
    };

    loadingManager.onLoadingComplete(onComplete);

    // Update progress periodically
    const progressInterval = setInterval(() => {
      setProgress(loadingManager.getProgress());
    }, 100);

    // Absolute maximum timeout - force complete after 5 seconds no matter what
    const maxTimeout = setTimeout(() => {
      console.warn('Maximum loading timeout reached - forcing app to load');
      handleLoadingComplete();
    }, 5000);

    return () => {
      loadingManager.removeCallback(onComplete);
      clearInterval(progressInterval);
      clearTimeout(maxTimeout);
    };
  }, [loadingManager, handleLoadingComplete]);

  return {
    isLoading,
    progress,
    onLoadingComplete: handleLoadingComplete
  };
};
