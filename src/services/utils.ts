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
