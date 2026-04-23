// Background Configuration
// Add your background images here and they will be automatically available

// Import background images
import backgroundTexture from '../assets/images/background-texture.jpg';

export interface BackgroundConfig {
  image: string;
  size: 'cover' | 'contain' | 'auto' | string;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right' | string;
  attachment: 'fixed' | 'scroll' | 'local';
  repeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  fallbackColor: string;
}

// Available background configurations
export const BACKGROUND_PRESETS: Record<string, BackgroundConfig> = {
  texture: {
    image: backgroundTexture,
    size: 'cover',
    position: 'center',
    attachment: 'fixed',
    repeat: 'no-repeat',
    fallbackColor: '#F5FAFF'
  },
  solid: {
    image: '',
    size: 'cover',
    position: 'center',
    attachment: 'fixed',
    repeat: 'no-repeat',
    fallbackColor: '#F5FAFF'
  }
};

// Current background preset
export const CURRENT_BACKGROUND = 'texture';

// Helper function to get current background config
export const getCurrentBackground = (): BackgroundConfig => {
  return BACKGROUND_PRESETS[CURRENT_BACKGROUND] || BACKGROUND_PRESETS.solid;
};

// Helper function to change background
export const setBackground = (presetName: string): BackgroundConfig => {
  if (BACKGROUND_PRESETS[presetName]) {
    return BACKGROUND_PRESETS[presetName];
  }
  console.warn(`Background preset "${presetName}" not found. Using solid background.`);
  return BACKGROUND_PRESETS.solid;
};
