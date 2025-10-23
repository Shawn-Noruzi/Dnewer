/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const MOBILE_WIDTH = 640; // Width for mobile images
const WEBP_QUALITY = 100; // 0-100, higher means better quality but larger file size
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png']; // Add more formats if needed

async function convertImages(inputPath) {
  try {
    // Resolve the path relative to current working directory
    const absolutePath = path.resolve(process.cwd(), inputPath);
    
    // Check if directory exists
    const stats = await fs.stat(absolutePath);
    if (!stats.isDirectory()) {
      throw new Error('Provided path is not a directory');
    }

    // Read all files in the directory
    const files = await fs.readdir(absolutePath);
    console.log(`Processing directory: ${absolutePath}`);
    console.log(`Found ${files.length} files`);

    for (const file of files) {
      const filePath = path.join(absolutePath, file);
      const ext = path.extname(file).toLowerCase();
      const baseName = path.basename(file, ext);

      // Skip if not a supported image format
      if (!SUPPORTED_FORMATS.includes(ext)) {
        console.log(`Skipping ${file} - not a supported image format`);
        continue;
      }

      try {
        // Load the image
        const image = sharp(filePath);
        const metadata = await image.metadata();

        // Create desktop WebP version
        await image
          .webp({ quality: WEBP_QUALITY })
          .toFile(path.join(absolutePath, `${baseName}-desktop.webp`));
        console.log(`✓ Created desktop WebP version: ${baseName}-desktop.webp`);

        // Create mobile version if original is larger than mobile width
        if (metadata.width > MOBILE_WIDTH) {
          await image
            .resize(MOBILE_WIDTH)
            .webp({ quality: WEBP_QUALITY })
            .toFile(path.join(absolutePath, `${baseName}-mobile.webp`));
          console.log(`✓ Created mobile version: ${baseName}-mobile.webp`);
        } else {
          console.log(`⚠ Skipping mobile version for ${file} - already smaller than ${MOBILE_WIDTH}px`);
        }

        // Log original image dimensions
        console.log(`  Original size: ${metadata.width}x${metadata.height}px`);

      } catch (err) {
        console.error(`Error processing ${file}:`, err.message);
      }
    }

    console.log('\nConversion completed! 🎉');
    console.log('Desktop images suffix: -desktop');
    console.log('Mobile images suffix: -mobile');

  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

// Get directory path from command line argument
const directoryPath = process.argv[2];

if (!directoryPath) {
  console.error('Please provide a directory path');
  console.error('Usage: node photoOptimization.js /path/to/your/images');
  process.exit(1);
}

// Run the conversion
convertImages(directoryPath);