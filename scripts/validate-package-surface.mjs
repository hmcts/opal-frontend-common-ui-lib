import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const packageDir = resolve(process.argv[2] ?? 'dist/opal-frontend-common');
const npmCacheDir = mkdtempSync(join(tmpdir(), 'opal-common-ui-npm-cache-'));

const allowedTopLevelPaths = new Set([
  'README.md',
  'LICENSE',
  'CHANGELOG.md',
  'package.json',
  'components',
  'constants',
  'directives',
  'fesm2022',
  'guards',
  'interceptors',
  'pages',
  'pipes',
  'resolvers',
  'services',
  'stores',
  'styles',
  'types',
  'validators',
]);

function collectExportTargets(value, collector) {
  if (typeof value === 'string') {
    if (value.startsWith('./')) {
      collector.add(value.slice(2));
    }
    return;
  }

  if (value && typeof value === 'object') {
    Object.values(value).forEach((nested) => collectExportTargets(nested, collector));
  }
}

try {
  const raw = execFileSync('npm', ['pack', '--dry-run', '--json'], {
    cwd: packageDir,
    encoding: 'utf8',
    env: { ...process.env, NPM_CONFIG_CACHE: npmCacheDir },
  });
  const [packResult] = JSON.parse(raw);
  if (!packResult || !Array.isArray(packResult.files)) {
    throw new Error('npm pack --dry-run did not return a file list.');
  }

  const filePaths = packResult.files.map((entry) => entry.path);
  const fileSet = new Set(filePaths);
  const issues = [];

  ['package.json', 'README.md', 'LICENSE'].forEach((requiredFile) => {
    if (!fileSet.has(requiredFile)) {
      issues.push(`Missing required packed file: ${requiredFile}`);
    }
  });

  if (!filePaths.some((filePath) => filePath.startsWith('fesm2022/') && filePath.endsWith('.mjs'))) {
    issues.push('Packed tarball does not contain any FESM `.mjs` files.');
  }

  if (!filePaths.some((filePath) => filePath.startsWith('types/') && filePath.endsWith('.d.ts'))) {
    issues.push('Packed tarball does not contain any declaration `.d.ts` files.');
  }

  if (!filePaths.some((filePath) => filePath.startsWith('styles/'))) {
    issues.push('Packed tarball does not contain `styles/` assets.');
  }

  for (const filePath of filePaths) {
    const topLevelPath = filePath.split('/')[0];
    if (!allowedTopLevelPaths.has(topLevelPath)) {
      issues.push(`Unexpected top-level packed path: ${filePath}`);
    }

    if (filePath.endsWith('.spec.ts') || filePath.endsWith('.test.ts')) {
      issues.push(`Test artifact should not be packed: ${filePath}`);
    }

    if (filePath.endsWith('.ts') && !filePath.endsWith('.d.ts')) {
      issues.push(`Source TypeScript should not be packed: ${filePath}`);
    }

    if (filePath.endsWith('.scss') && !filePath.startsWith('styles/')) {
      issues.push(`SCSS outside styles entrypoints should not be packed: ${filePath}`);
    }
  }

  const packageJson = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'));
  const exportTargets = new Set();
  collectExportTargets(packageJson.exports, exportTargets);

  for (const exportTarget of exportTargets) {
    if (!fileSet.has(exportTarget)) {
      issues.push(`Export target is missing from packed tarball: ${exportTarget}`);
    }
  }

  if (issues.length > 0) {
    console.error('Package surface validation failed:');
    issues.forEach((issue) => console.error(`- ${issue}`));
    process.exit(1);
  }

  console.log(`Package surface validation passed for ${packResult.name}@${packResult.version}.`);
  console.log(`Packed files: ${packResult.entryCount}`);
  console.log(`Unpacked size: ${packResult.unpackedSize} bytes`);
} finally {
  rmSync(npmCacheDir, { recursive: true, force: true });
}
