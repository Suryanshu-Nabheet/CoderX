const { execSync } = require('child_process');

const getGitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
};

const version = process.env.npm_package_version ?? '0.0.0';
const hash = getGitHash();

console.log('');
console.log('CoderX');
console.log(`Version: v${version} (${hash})`);
console.log('Starting development server...');
console.log('');
