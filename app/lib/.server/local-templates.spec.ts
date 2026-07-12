import fs from 'node:fs/promises';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadBundledTemplate, normalizeTemplateId } from '~/lib/.server/local-templates';

const FIXTURE_DIR = path.join(process.cwd(), 'templates', 'test-template');

describe('local-templates', () => {
  beforeEach(async () => {
    await fs.mkdir(path.join(FIXTURE_DIR, '.coderx'), { recursive: true });
    await fs.writeFile(path.join(FIXTURE_DIR, 'package.json'), '{"name":"test-template"}');
    await fs.writeFile(path.join(FIXTURE_DIR, '.coderx', 'prompt'), 'Use this template.');
    await fs.writeFile(path.join(FIXTURE_DIR, '.coderx', 'ignore'), 'package-lock.json');
  });

  afterEach(async () => {
    await fs.rm(path.join(process.cwd(), 'templates', 'test-template'), { recursive: true, force: true });
  });

  it('normalizes template identifiers', () => {
    expect(normalizeTemplateId('coderx-expo-template')).toBe('coderx-expo-template');
  });

  it('loads bundled template files from disk', async () => {
    const files = await loadBundledTemplate('test-template');

    expect(files.some((file) => file.path === 'package.json')).toBe(true);
    expect(files.some((file) => file.path === '.coderx/prompt')).toBe(true);
    expect(files.some((file) => file.path === '.coderx/ignore')).toBe(true);
  });

  it('throws when a bundled template is missing', async () => {
    await expect(loadBundledTemplate('missing-template')).rejects.toThrow(/Bundled template not found/);
  });

  it('loads binary template files as base64', async () => {
    await fs.mkdir(path.join(FIXTURE_DIR, 'assets'), { recursive: true });
    await fs.writeFile(path.join(FIXTURE_DIR, 'assets', 'icon.png'), Buffer.from([0x89, 0x50, 0x4e, 0x47]));

    const files = await loadBundledTemplate('test-template');
    const icon = files.find((file) => file.path === 'assets/icon.png');

    expect(icon?.encoding).toBe('base64');
    expect(icon?.content).toBe(Buffer.from([0x89, 0x50, 0x4e, 0x47]).toString('base64'));
  });
});
