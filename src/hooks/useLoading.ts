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

    return () => {
      loadingManager.removeCallback(onComplete);
      clearInterval(progressInterval);
    };
  }, [loadingManager, handleLoadingComplete]);

  return {
    isLoading,
    progress,
    onLoadingComplete: handleLoadingComplete
  };
};
