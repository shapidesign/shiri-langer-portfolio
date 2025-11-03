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
    loadingManager.onLoadingComplete(handleLoadingComplete);

    // Update progress periodically
    const progressInterval = setInterval(() => {
      setProgress(loadingManager.getProgress());
    }, 100);

    return () => {
      loadingManager.removeCallback(handleLoadingComplete);
      clearInterval(progressInterval);
    };
  }, [loadingManager, handleLoadingComplete]);

  return {
    isLoading,
    progress,
    onLoadingComplete: handleLoadingComplete
  };
};
