const https = require('https');
const http = require('http');
const imageSize = require('image-size').imageSize;
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const urls = [
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-a-private-ch-e336a153-20251018105040.jpg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-a-priva-eb946e05-20251024112454.jpg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-beautif-052b2939-20251027101941.jpg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-a-priva-23564d70-20251024130257.jpg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Unknown-1-1765203408189.jpeg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Unknown-1765203410720.jpeg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-a-hen-p-ad7cda19-20251208143330.jpg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-a-fun-h-50c33e05-20251208144301.jpg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/stock-photograph-of-hen-party-life-drawi-9de7246e-20251208144301.jpg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-life-drawing--c1728805-20251208144302.jpg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-women-m-ae355045-20251024112745.jpg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-beautif-6e71a563-20251024112747.jpg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-group-o-c6f54c3e-20251024112747.jpg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/hen-party-cocktail-classes-4-e1657801576427.jpg-1760963913852.webp",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photograph-of-a-sip-a-b0921423-20251024095025.jpg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-luxury-spa-t-15d1f1e0-20251021222805.jpg",
  "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-photograph-of-a-a-luxury-uk-c-082eb61b-20251209095213.jpg"
];

function checkImageDimensions(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.get(url, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        try {
          const buffer = Buffer.concat(chunks);
          const dimensions = imageSize(buffer);
          const size = buffer.length / 1024 / 1024; // MB
          resolve({ url, dimensions, size, buffer });
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function main() {
  console.log('Checking image dimensions and sizes...\n');
  const results = [];
  for (const url of urls) {
    try {
      const { dimensions, size, buffer } = await checkImageDimensions(url);
      const { width, height } = dimensions;
      console.log(`${width}x${height} - ${size.toFixed(2)} MB - ${url.split('/').pop()}`);
      
      const filename = url.split('/').pop();
      if (width !== 1280 || height !== 896) {
        console.log(`  Resizing to 1280x896...`);
        const resizedBuffer = await sharp(buffer)
          .resize(1280, 896, { fit: 'cover', position: 'center' })
          .jpeg({ quality: 85 })
          .toBuffer();
        const resizedPath = path.join(__dirname, `resized_${filename}`);
        fs.writeFileSync(resizedPath, resizedBuffer);
        console.log(`  Saved resized image to ${resizedPath}`);
      }
      
      results.push({ width, height, size, filename });
    } catch (error) {
      console.log(`ERROR: ${url.split('/').pop()} - ${error.message}`);
      results.push({ error: true, filename: url.split('/').pop() });
    }
  }

  // Group by dimensions
  const groups = {};
  results.forEach(result => {
    if (result.error) return;
    const key = `${result.width}x${result.height}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(result);
  });

  console.log('\nImage dimension groups:');
  Object.keys(groups).forEach(key => {
    console.log(`\n${key} (${groups[key].length} images):`);
    groups[key].forEach(img => {
      console.log(`  - ${img.filename} (${img.size.toFixed(2)} MB)`);
    });
  });

  // Check if all have same dimensions
  const validResults = results.filter(r => !r.error);
  if (validResults.length === 0) {
    console.log('\nNo valid images to compare.');
    return;
  }

  const allSame = Object.keys(groups).length === 1;
  console.log(`\nAll images have the same dimensions: ${allSame ? 'YES' : 'NO'}`);
}

main();