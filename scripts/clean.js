import { rm, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dirsToRemove = ['node_modules/.vite', 'node_modules/.cache', '.cache', 'dist', 'build'];

console.log('Cleaning project...');

for (const dir of dirsToRemove) {
  const fullPath = join(__dirname, '..', dir);

  if (existsSync(fullPath)) {
    console.log(`Removing ${dir}...`);
    rm(fullPath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error(`Error removing ${dir}:`, err.message);
      }
    });
  }
}

console.log('Reinstalling dependencies...');

try {
  execSync('pnpm install', { stdio: 'inherit' });
  execSync('pnpm cache clean', { stdio: 'inherit' });
  execSync('pnpm build', { stdio: 'inherit' });
  console.log('Clean completed. Run pnpm run dev to start.');
} catch (err) {
  console.error('Error during cleanup:', err instanceof Error ? err.message : err);
  process.exit(1);
}
