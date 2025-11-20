# Background System Guide

This system makes it easy to manage background images and textures for your portfolio website.

## How to Add a New Background Image

### Step 1: Add Your Image
1. Place your image file in `/src/assets/images/`
2. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

### Step 2: Import the Image
In `/src/config/backgroundConfig.ts`, add your import:
```typescript
import yourNewTexture from '../assets/images/your-texture.jpg';
```

### Step 3: Add Background Preset
In the same file, add a new preset to `BACKGROUND_PRESETS`:
```typescript
export const BACKGROUND_PRESETS: Record<string, BackgroundConfig> = {
  // ... existing presets
  yourNewPreset: {
    image: yourNewTexture,
    size: 'cover',
    position: 'center',
    attachment: 'fixed',
    repeat: 'no-repeat',
    fallbackColor: '#F5F3F0'
  }
};
```

### Step 4: Set as Current Background
Change the `CURRENT_BACKGROUND` constant:
```typescript
export const CURRENT_BACKGROUND = 'yourNewPreset';
```

## Background Configuration Options

### `size`
- `'cover'` - Scales to cover entire container (recommended)
- `'contain'` - Scales to fit within container
- `'auto'` - Original size
- Custom: `'100% 100%'`, `'800px 600px'`, etc.

### `position`
- `'center'` - Centers the image (recommended)
- `'top'`, `'bottom'`, `'left'`, `'right'`
- Custom: `'top left'`, `'50% 25%'`, etc.

### `attachment`
- `'fixed'` - Background stays fixed during scroll (recommended)
- `'scroll'` - Background scrolls with content
- `'local'` - Background scrolls with element content

### `repeat`
- `'no-repeat'` - Image appears once (recommended)
- `'repeat'` - Repeats in both directions
- `'repeat-x'` - Repeats horizontally
- `'repeat-y'` - Repeats vertically

### `fallbackColor`
- Hex color code (e.g., `'#F5F3F0'`)
- Used when image fails to load

## Quick Examples

### Concrete Texture
```typescript
concrete: {
  image: concreteTexture,
  size: 'cover',
  position: 'center',
  attachment: 'fixed',
  repeat: 'no-repeat',
  fallbackColor: '#8B8B8B'
}
```

### Paper Texture
```typescript
paper: {
  image: paperTexture,
  size: 'cover',
  position: 'center',
  attachment: 'fixed',
  repeat: 'no-repeat',
  fallbackColor: '#F5F5DC'
}
```

### Gradient Background
```typescript
gradient: {
  image: '', // No image
  size: 'cover',
  position: 'center',
  attachment: 'fixed',
  repeat: 'no-repeat',
  fallbackColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}
```

## Troubleshooting

### Image Not Loading
1. Check file path is correct
2. Ensure image is in `/src/assets/images/`
3. Verify import statement
4. Check browser console for errors

### Performance Issues
1. Optimize image size (recommended: under 500KB)
2. Use WebP format for better compression
3. Consider using `'scroll'` instead of `'fixed'` for large images

### Mobile Issues
1. Test on mobile devices
2. Consider using `'scroll'` attachment for better mobile performance
3. Ensure fallback color works well

## Current System Benefits

✅ **No more path resolution errors**
✅ **Easy to change backgrounds**
✅ **Fallback color protection**
✅ **TypeScript support**
✅ **Performance optimized**
✅ **Mobile friendly**
