import React from 'react';
import { getCurrentBackground } from '../config/backgroundConfig';

interface BackgroundManagerProps {
  children: React.ReactNode;
}

const BackgroundManager: React.FC<BackgroundManagerProps> = ({ children }) => {
  const backgroundConfig = getCurrentBackground();
  
  return (
    <div 
      className="background-manager"
      style={{
        backgroundImage: backgroundConfig.image ? `url(${backgroundConfig.image})` : 'none',
        backgroundSize: backgroundConfig.size,
        backgroundPosition: backgroundConfig.position,
        backgroundAttachment: backgroundConfig.attachment,
        backgroundRepeat: backgroundConfig.repeat,
        backgroundColor: backgroundConfig.fallbackColor,
        minHeight: '100vh',
        width: '100%'
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundManager;
