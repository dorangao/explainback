import { readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const key = process.env.MODEL_API_KEY?.trim();
if (!key) { console.error('Key is missing; cannot perform a value-based leak check.'); process.exitCode = 1; }
else {
  let count = 0;
  const leaks = [];
  async function scan(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (['.git', 'node_modules', '.env.local'].includes(entry.name)) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) await scan(path);
      else if (entry.isFile()) { count++; if ((await readFile(path)).includes(Buffer.from(key))) leaks.push(path.slice(root.length)); }
    }
  }
  await scan(root);
  const mode = (await stat(join(root, '.env.local'))).mode & 0o777;
  const ignores = await readFile(join(root, '.gitignore'), 'utf8');
  const protectedFile = mode === 0o600 && ignores.split('\n').includes('.env.*');
  if (leaks.length || !protectedFile) {
    console.error('FAIL: secret protection check. Files with a key match:', leaks.length ? leaks.join(', ') : 'none');
    console.error('Private file permissions and ignore rule:', protectedFile ? 'pass' : 'review needed');
    process.exitCode = 1;
  } else console.log(`PASS: configured key absent from ${count} other project files; .env.local has private permissions and an ignore rule. Key value hidden.`);
}
