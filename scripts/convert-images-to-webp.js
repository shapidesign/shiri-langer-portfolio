/**
 * Script to batch convert images to WebP format
 * 
 * Requirements:
 * - Install sharp: npm install --save-dev sharp
 * - Run: node scripts/convert-images-to-webp.js
 * 
 * This script will:
 * 1. Find all JPG/PNG images in public/assets/images
 * 2. Convert them to WebP
 * 3. Keep originals as fallback
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const IMAGE_DIRS = [
  'public/assets/images',
  'src/assets/images'
];

const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

async function convertImageToWebP(imagePath) {
  try {
    const ext = path.extname(imagePath).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      return;
    }

    const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    // Skip if WebP already exists
    try {
      await fs.access(webpPath);
      console.log(`✓ WebP already exists: ${webpPath}`);
      return;
    } catch {
      // File doesn't exist, proceed with conversion
    }

    // Convert to WebP
    await sharp(imagePath)
      .webp({ quality: 85, effort: 6 }) // Good balance of quality and file size
      .toFile(webpPath);

    const originalStats = await fs.stat(imagePath);
    const webpStats = await fs.stat(webpPath);
    const savings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);

    console.log(`✓ Converted: ${path.basename(imagePath)} → ${path.basename(webpPath)} (${savings}% smaller)`);
  } catch (error) {
    console.error(`✗ Error converting ${imagePath}:`, error.message);
  }
}

async function findImages(dir) {
  const images = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively search subdirectories
        const subImages = await findImages(fullPath);
        images.push(...subImages);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          images.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  
  return images;
}

async function main() {
  console.log('🖼️  Starting WebP conversion...\n');

  // Check if sharp is installed
  try {
    require('sharp');
  } catch {
    console.error('❌ Error: sharp is not installed.');
    console.log('   Please run: npm install --save-dev sharp');
    process.exit(1);
  }

  const allImages = [];

  // Find all images in target directories
  for (const dir of IMAGE_DIRS) {
    const images = await findImages(dir);
    allImages.push(...images);
  }

  if (allImages.length === 0) {
    console.log('⚠️  No images found to convert.');
    return;
  }

  console.log(`Found ${allImages.length} images to process...\n`);

  // Convert all images
  for (const imagePath of allImages) {
    await convertImageToWebP(imagePath);
  }

  console.log('\n✅ Conversion complete!');
  console.log('\nNext steps:');
  console.log('1. Update OptimizedImage component to prefer WebP');
  console.log('2. Test images load correctly');
  console.log('3. Consider removing original JPG/PNG files after testing');
}

main().catch(console.error);

