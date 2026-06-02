import { cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

async function copyIntoDist(source, target) {
  await cp(resolve(root, source), resolve(dist, target), {
    recursive: true,
    force: true,
    errorOnExist: false,
  });
}

await mkdir(dist, { recursive: true });
await copyIntoDist('en', 'en');
await copyIntoDist('assets', 'assets');
