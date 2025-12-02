// Background Configuration - Simplified (no texture image)

export interface BackgroundConfig {
  image: string;
  size: 'cover' | 'contain' | 'auto' | string;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right' | string;
  attachment: 'fixed' | 'scroll' | 'local';
  repeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  fallbackColor: string;
}

// Simple solid background using palette
export const getCurrentBackground = (): BackgroundConfig => {
  return {
    image: '',
    size: 'cover',
    position: 'center',
    attachment: 'fixed',
    repeat: 'no-repeat',
    fallbackColor: '#F8F4ED' // Crystal Cut from palette
  };
};
