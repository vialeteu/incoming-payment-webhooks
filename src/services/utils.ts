import * as fs from 'node:fs';
import * as path from 'path';

/**
 * Get the value of an environment variable
 * @param name - name of the environment variable
 * @throws {Error} If the environment variable is not defined
 */
export function envVar(name: string): string {
  const evnVar = process.env[name];
  if (!evnVar) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return evnVar;
}

/**
 * Loads the content of a private key file
 * @param {string} filePath - The path to the private key file. Defaults to
 *               './keys/private.pem' relative to the current working directory.
 * @returns {string} The content of the private key file.
 * @throws {Error} If there are issues reading the file
 */

export function loadKeyFromFile(
  filePath: string = path.resolve(process.cwd(), './keys/private.pem')
): string {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    const typedError = error as NodeJS.ErrnoException;
    if (typedError.code === 'ENOENT') {
      throw new Error('No key file found');
    } else {
      throw new Error('Error reading key file');
    }
  }
}
