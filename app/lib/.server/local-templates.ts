import fs from 'node:fs/promises';
import path from 'node:path';

export interface TemplateFile {
  name: string;
  path: string;
  content: string;
  encoding?: 'utf8' | 'base64';
}

const MAX_FILE_SIZE = 500_000;

const SKIP_FILES = new Set(['.DS_Store', 'Thumbs.db']);

const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.html',
  '.css',
  '.scss',
  '.sass',
  '.vue',
  '.svelte',
  '.astro',
  '.yml',
  '.yaml',
  '.toml',
  '.env',
  '.txt',
  '.svg',
  '.gitignore',
  '.npmrc',
  '.prettierrc',
  '.editorconfig',
]);

const BINARY_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.mp3',
  '.mp4',
  '.wasm',
  '.pdf',
  '.zip',
]);

const TEXT_FILENAMES = new Set(['Dockerfile', 'LICENSE', 'NOTICE', 'README', 'prompt', 'ignore', 'robots.txt']);

function resolveTemplatesRoot(): string {
  if (process.env.CODERX_TEMPLATES_ROOT) {
    return path.resolve(process.env.CODERX_TEMPLATES_ROOT);
  }

  return path.resolve(process.cwd(), 'templates');
}

function shouldSkipFile(relativePath: string): boolean {
  const basename = path.basename(relativePath);
  return SKIP_FILES.has(basename);
}

function isTextFile(relativePath: string): boolean {
  const basename = path.basename(relativePath);

  if (TEXT_FILENAMES.has(basename)) {
    return true;
  }

  const ext = path.extname(relativePath).toLowerCase();
  return TEXT_EXTENSIONS.has(ext) || (basename.startsWith('.') && !SKIP_FILES.has(basename));
}

function isBinaryFile(relativePath: string): boolean {
  return BINARY_EXTENSIONS.has(path.extname(relativePath).toLowerCase());
}

export function normalizeTemplateId(templateId: string): string {
  return templateId.includes('/') ? templateId.split('/').pop()! : templateId;
}

async function readTemplateFile(fullPath: string, relativePath: string): Promise<TemplateFile | null> {
  if (shouldSkipFile(relativePath)) {
    return null;
  }

  const name = path.basename(relativePath);

  if (isTextFile(relativePath)) {
    const content = await fs.readFile(fullPath, 'utf8');

    return {
      name,
      path: relativePath,
      content,
      encoding: 'utf8',
    };
  }

  if (isBinaryFile(relativePath)) {
    const buffer = await fs.readFile(fullPath);

    if (buffer.length > MAX_FILE_SIZE) {
      console.warn(`Skipping large template file: ${relativePath} (${buffer.length} bytes)`);
      return null;
    }

    return {
      name,
      path: relativePath,
      content: buffer.toString('base64'),
      encoding: 'base64',
    };
  }

  return null;
}

async function walkDirectory(dir: string, baseDir: string): Promise<TemplateFile[]> {
  const files: TemplateFile[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (entry.name === '.git') {
        continue;
      }

      files.push(...(await walkDirectory(fullPath, baseDir)));
      continue;
    }

    const file = await readTemplateFile(fullPath, relativePath);

    if (file) {
      files.push(file);
    }
  }

  return files;
}

export async function loadBundledTemplate(templateId: string): Promise<TemplateFile[]> {
  const normalizedId = normalizeTemplateId(templateId);
  const templateDir = path.join(resolveTemplatesRoot(), normalizedId);

  try {
    await fs.access(templateDir);
  } catch {
    throw new Error(`Bundled template not found: ${normalizedId}.`);
  }

  return walkDirectory(templateDir, templateDir);
}
