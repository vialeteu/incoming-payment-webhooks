import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Loads environment variables from a .env file into process.env
 * @param filePath - Path to the .env file. Defaults to '.env' in current
 *                   working directory
 * @throws {Error} If there are issues reading the file
 * @example
 * ```typescript
 * loadEnv(); // Loads .env from current directory
 * loadEnv('.env.development'); // Load from specific path
 * ```
 */
export function loadEnvFile(
  filePath: string = path.resolve(process.cwd(), '.env')
): void {
  try {
    // Read the .env file
    const envContents = fs.readFileSync(filePath, 'utf8');

    // Parse the file line by line
    envContents.split('\n').forEach((line) => {
      // Trim whitespace and ignore comments and empty lines
      line = line.trim();
      const isCommentedLine = line.startsWith('#');
      if (line && !isCommentedLine) {
        const match = line.match(/^([^=]+)=(.*)$/);

        if (match) {
          const [, key, value] = match;
          const trimmedKey = key.trim();

          // Remove quotes and trim value
          const cleanValue = value
            .trim()
            .replace(/^(['"])(.+)\1$/, '$2')
            .trim();

          // Set environment variable
          if (trimmedKey) {
            process.env[trimmedKey] = cleanValue;
          }
        }
      }
    });
  } catch (error) {
    const typedError = error as NodeJS.ErrnoException;
    if (typedError.code === 'ENOENT') {
      throw new Error('No .env file found');
    } else {
      throw new Error('Error reading .env file');
    }
  }
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
