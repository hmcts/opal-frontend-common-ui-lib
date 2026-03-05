import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import ts from 'typescript';

const PACKAGE_NAME = '@hmcts/opal-frontend-common';
const PACKAGE_NAME_TYPOS = ['@hmcts/opal-fronted-common'];
const TS_CONFIG_PATH = resolve('tsconfig.json');
const LIB_PACKAGE_JSON_PATH = resolve('projects/opal-frontend-common/package.json');
const IGNORED_EXPORT_SUBPATHS = new Set(['./styles', './styles/styles.scss', './package.json']);

function formatCompilerError(error) {
  const message = ts.flattenDiagnosticMessageText(error.messageText, '\n');
  return `Failed to read ${TS_CONFIG_PATH}: ${message}`;
}

function toExportSubpath(pathAlias) {
  if (pathAlias === PACKAGE_NAME) {
    return '.';
  }

  const prefix = `${PACKAGE_NAME}/`;
  return `./${pathAlias.slice(prefix.length)}`;
}

const configFile = ts.readConfigFile(TS_CONFIG_PATH, ts.sys.readFile);
if (configFile.error) {
  console.error(formatCompilerError(configFile.error));
  process.exit(1);
}

const compilerPaths = configFile.config?.compilerOptions?.paths ?? {};
const pathAliases = Object.keys(compilerPaths);

const typoAliases = pathAliases.filter((alias) =>
  PACKAGE_NAME_TYPOS.some((typoPrefix) => alias.startsWith(typoPrefix)),
);
const opalAliases = pathAliases.filter((alias) => alias === PACKAGE_NAME || alias.startsWith(`${PACKAGE_NAME}/`));
const aliasSubpaths = new Set(opalAliases.map(toExportSubpath));

const packageJson = JSON.parse(readFileSync(LIB_PACKAGE_JSON_PATH, 'utf8'));
const exportSubpaths = new Set(
  Object.keys(packageJson.exports ?? {}).filter((subpath) => !IGNORED_EXPORT_SUBPATHS.has(subpath)),
);

const onlyInPaths = [...aliasSubpaths].filter((subpath) => !exportSubpaths.has(subpath)).sort();
const onlyInExports = [...exportSubpaths].filter((subpath) => !aliasSubpaths.has(subpath)).sort();
const issues = [];

if (typoAliases.length > 0) {
  const formattedAliases = typoAliases.map((alias) => `\`${alias}\``).join(', ');
  issues.push(`Invalid alias prefix detected (possible typo): ${formattedAliases}`);
}

if (onlyInPaths.length > 0) {
  const paths = onlyInPaths.map((subpath) => `  - ${subpath}`).join('\n');
  issues.push(`Paths without matching source export keys:\n${paths}`);
}

if (onlyInExports.length > 0) {
  const exports = onlyInExports.map((subpath) => `  - ${subpath}`).join('\n');
  issues.push(`Source export keys without matching tsconfig alias:\n${exports}`);
}

if (issues.length > 0) {
  console.error('Path alias and source export map drift detected.');
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exit(1);
}

console.log('Path alias and source export map are in sync.');
