import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, '../public/models');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const modelName = 'gemma-4-E2B-it.litertlm';
const url = `https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm/resolve/main/${modelName}`;
const dest = path.join(dir, modelName);

console.log(`Downloading ${modelName} to ${dest}...`);
console.log('This is a large file (~2.5GB), so this might take several minutes depending on your connection.');

const file = fs.createWriteStream(dest);

function download(urlToFetch) {
  https.get(urlToFetch, (response) => {
    if (response.statusCode === 302 || response.statusCode === 301) {
      console.log(`Redirecting to ${response.headers.location}...`);
      download(response.headers.location);
      return;
    }

    if (response.statusCode !== 200) {
      console.error(`Failed to download: ${response.statusCode} ${response.statusMessage}`);
      return;
    }

    const totalBytes = parseInt(response.headers['content-length'], 10);
    let downloadedBytes = 0;

    response.pipe(file);

    response.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      const progress = ((downloadedBytes / totalBytes) * 100).toFixed(2);
      process.stdout.write(`\rProgress: ${progress}% (${(downloadedBytes / 1024 / 1024).toFixed(2)} MB / ${(totalBytes / 1024 / 1024).toFixed(2)} MB)`);
    });

    file.on('finish', () => {
      file.close();
      console.log('\nDownload complete! You can now use the model locally.');
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error(`\nError downloading file: ${err.message}`);
  });
}

download(url);
