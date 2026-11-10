const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const mammoth = require('mammoth');

const docxPath = 'C:/Users/nanak/.gemini/antigravity/brain/ffaa8103-626c-467c-93b9-229983aa82cb/.user_uploaded/media_1794326275108_7ff259eb.docx';

async function run() {
  // Extract cover image
  execSync(`tar -xf "${docxPath}" word/media/9c80e39ab061aa638ce2e4813aaac02c3588e654.jpg`);
  const src = 'word/media/9c80e39ab061aa638ce2e4813aaac02c3588e654.jpg';
  const dest = path.join(process.cwd(), 'public', 'covers', 'the-illusion-of-skill.jpg');
  fs.copyFileSync(src, dest);
  fs.rmSync('word', { recursive: true, force: true });
  console.log('Cover saved to:', dest);

  const result = await mammoth.convertToHtml({ path: docxPath });
  console.log('--- CONVERTED HTML LENGTH:', result.value.length);
  fs.writeFileSync(path.join(process.cwd(), 'lib', 'the-illusion-of-skill.html'), result.value, 'utf8');
}

run().catch(console.error);

