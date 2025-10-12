import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Fonts CSS URLs
const fontCssUrls = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap'
];

const outputDir = path.join(__dirname, '..', 'src', 'assets', 'fonts');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadFonts() {
  console.log('🔽 Starting font download...\n');

  const allFontUrls = [];
  const cssContent = [];

  // Step 1: Fetch CSS files to get font URLs
  for (const cssUrl of fontCssUrls) {
    try {
      console.log(`📄 Fetching CSS from: ${cssUrl}`);
      const response = await fetch(cssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch CSS: ${response.statusText}`);
      }

      let css = await response.text();
      console.log(`✓ CSS fetched successfully\n`);

      // Extract font URLs from CSS
      const fontUrlRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g;
      let match;

      while ((match = fontUrlRegex.exec(css)) !== null) {
        allFontUrls.push(match[1]);
      }

      cssContent.push(css);
    } catch (error) {
      console.error(`✗ Error fetching CSS: ${error.message}\n`);
    }
  }

  // Step 2: Download all font files
  console.log(`\n📦 Found ${allFontUrls.length} font files to download\n`);

  const downloadedFonts = new Map();

  for (let i = 0; i < allFontUrls.length; i++) {
    const fontUrl = allFontUrls[i];
    try {
      const urlObj = new URL(fontUrl);
      const pathParts = urlObj.pathname.split('/');
      const filename = pathParts[pathParts.length - 1];

      console.log(`[${i + 1}/${allFontUrls.length}] Downloading: ${filename}`);

      const response = await fetch(fontUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch font: ${response.statusText}`);
      }

      const buffer = await response.arrayBuffer();
      const outputPath = path.join(outputDir, filename);

      fs.writeFileSync(outputPath, Buffer.from(buffer));
      console.log(`✓ Saved to: ${filename}\n`);

      downloadedFonts.set(fontUrl, filename);
    } catch (error) {
      console.error(`✗ Error downloading font: ${error.message}\n`);
    }
  }

  // Step 3: Update CSS to use local paths
  console.log('📝 Generating local CSS...\n');

  let localCss = '';
  for (let css of cssContent) {
    // Replace Google Fonts URLs with local paths
    for (const [originalUrl, filename] of downloadedFonts.entries()) {
      css = css.replace(originalUrl, `./fonts/${filename}`);
    }
    localCss += css + '\n\n';
  }

  // Save local CSS file
  const localCssPath = path.join(outputDir, 'fonts.css');
  fs.writeFileSync(localCssPath, localCss);
  console.log(`✓ Local CSS saved to: fonts.css`);

  console.log(`\n✅ Font download complete! Downloaded ${downloadedFonts.size} files.`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Import in your CSS: @import "../assets/fonts/fonts.css";`);
  console.log(`   2. Remove Google Fonts links from HTML`);
}

downloadFonts();
