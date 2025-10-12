import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asset URLs from Figma
const assets = [
  { url: 'http://localhost:3845/assets/3f1adb475b24dcb45e976fac2ca6af77fc7c43dc.svg', name: 'quill-hamburger.svg' },
  { url: 'http://localhost:3845/assets/0429fc238f840b4fa42a6877ac5837dd72a319ec.svg', name: 'settings-group.svg' },
  { url: 'http://localhost:3845/assets/2f5366fe09bc7b6be5995f8dd90e1bdd8e97f08c.svg', name: 'line.svg' },
  { url: 'http://localhost:3845/assets/cea1a085b689d9afb57726f1e34c75774c0ae6a6.svg', name: 'title-control-minimize.svg' },
  { url: 'http://localhost:3845/assets/aa749f020b8726f025908eb7b093df00dba56b79.svg', name: 'title-control-maximize.svg' },
  { url: 'http://localhost:3845/assets/ef37142999a9249f7140cc09aaf0f1582ed4771b.svg', name: 'title-control-close.svg' },
  { url: 'http://localhost:3845/assets/f09ae2e840c6a1bba7aa9657cd0f1773164f1617.svg', name: 'prime-upload.svg' },
  { url: 'http://localhost:3845/assets/88e33a9121936779527be561aa6ac90e28deb782.svg', name: 'mynaui-send.svg' }
];

const outputDir = path.join(__dirname, '..', 'src', 'assets', 'figma');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Download all assets
async function downloadAssets() {
  console.log('Starting asset download...');

  for (const asset of assets) {
    try {
      const response = await fetch(asset.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${asset.name}: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const outputPath = path.join(outputDir, asset.name);

      fs.writeFileSync(outputPath, Buffer.from(buffer));
      console.log(`✓ Downloaded: ${asset.name}`);
    } catch (error) {
      console.error(`✗ Error downloading ${asset.name}:`, error.message);
    }
  }

  console.log('\nAsset download complete!');
}

downloadAssets();
