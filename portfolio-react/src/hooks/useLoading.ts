import { useState, useEffect, useCallback } from 'react';
import { LoadingManager } from '../managers/LoadingManager';

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(true);
  const loadingManager = LoadingManager.getInstance();

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Initialize loading manager - this starts the image preloading
    loadingManager.initialize();

    // The LoadingScreen component will handle progress tracking
    // and will call handleLoadingComplete when all images are loaded
    
    return () => {
      // Cleanup if needed
    };
  }, [loadingManager]);

  return {
    isLoading,
    onLoadingComplete: handleLoadingComplete
  };
};
