import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logoPath = path.join(__dirname, '../../../draugar-logo.png');
const assetsPath = path.join(__dirname, '../assets');

async function generateIcons() {
  console.log('Generating app icons from logo...');

  // Get original image info
  const metadata = await sharp(logoPath).metadata();
  console.log(`Original logo: ${metadata.width}x${metadata.height}`);

  // Generate icon.png (1024x1024 for iOS)
  await sharp(logoPath)
    .resize(1024, 1024, { fit: 'contain', background: { r: 15, g: 15, b: 15, alpha: 1 } })
    .png()
    .toFile(path.join(assetsPath, 'icon.png'));
  console.log('Created: icon.png (1024x1024)');

  // Generate adaptive-icon.png (same as icon for Android)
  await sharp(logoPath)
    .resize(1024, 1024, { fit: 'contain', background: { r: 15, g: 15, b: 15, alpha: 1 } })
    .png()
    .toFile(path.join(assetsPath, 'adaptive-icon.png'));
  console.log('Created: adaptive-icon.png (1024x1024)');

  // Generate favicon.png (48x48 for web)
  await sharp(logoPath)
    .resize(48, 48, { fit: 'contain', background: { r: 15, g: 15, b: 15, alpha: 1 } })
    .png()
    .toFile(path.join(assetsPath, 'favicon.png'));
  console.log('Created: favicon.png (48x48)');

  // Generate splash-icon.png (200x200 for splash screen)
  await sharp(logoPath)
    .resize(200, 200, { fit: 'contain', background: { r: 15, g: 15, b: 15, alpha: 1 } })
    .png()
    .toFile(path.join(assetsPath, 'splash-icon.png'));
  console.log('Created: splash-icon.png (200x200)');

  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
