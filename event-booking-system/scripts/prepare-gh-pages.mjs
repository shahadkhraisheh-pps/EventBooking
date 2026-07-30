import { copyFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const distRoot = join(projectRoot, 'dist');

function findBrowserOutput(dir) {
  if (!existsSync(dir)) {
    return null;
  }

  const browserDir = join(dir, 'browser');
  if (existsSync(browserDir) && existsSync(join(browserDir, 'index.html'))) {
    return browserDir;
  }

  if (existsSync(join(dir, 'index.html'))) {
    return dir;
  }

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      const found = findBrowserOutput(fullPath);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
const angularVersion =
  packageJson.dependencies?.['@angular/core'] ??
  packageJson.devDependencies?.['@angular/core'] ??
  'unknown';

console.log(`Detected Angular version: ${angularVersion}`);

const outputDir = findBrowserOutput(distRoot);
if (!outputDir) {
  console.error('Could not find Angular build output under dist/. Run a production build first.');
  process.exit(1);
}

copyFileSync(join(outputDir, 'index.html'), join(outputDir, '404.html'));
writeFileSync(join(outputDir, '.nojekyll'), '');

const relativeOutputDir = relative(projectRoot, outputDir).replace(/\\/g, '/');
writeFileSync(join(projectRoot, 'dist', '.gh-pages-dir'), relativeOutputDir);

console.log(`Prepared GitHub Pages files in: ${outputDir}`);
console.log(`Relative output directory: ${relativeOutputDir}`);
console.log('- Copied index.html -> 404.html (SPA routing fallback)');
console.log('- Created .nojekyll');
