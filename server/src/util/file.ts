import { readFileSync } from 'fs';
import path from 'path';
import type { RawKey } from '@ssasy-auth/core';

/**
 * Returns the path to the project root
 * 
 * @returns path to the project root
 */
function getProjectRoot(): string {
  const cwd = process.cwd();
  const root = path.resolve(cwd);
  return root;
}

/**
 * Returns the raw key from the key.json file in the keys folder
 * at the project root
 * 
 * @returns raw key
 */
function getKey(): RawKey {
  const root = getProjectRoot();
  // from the root, go to keys/key.json
  const keyPath = path.resolve(root, 'keys', 'key.json');
  // read the file
  const content = readFileSync(keyPath, 'utf-8');

  return JSON.parse(content) as RawKey;
}

export {
  getProjectRoot,
  getKey
};