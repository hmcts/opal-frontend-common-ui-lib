import { configDefaults, coverageConfigDefaults } from 'vitest/config';

const projectFileExclude = [
  'projects/**/public-api.ts',
  'projects/**/*.routing.ts',
  'projects/**/*.routes.ts',
  'projects/**/*.constant.ts',
  'projects/**/*.interface.ts',
  'projects/**/*.type.ts',
  'projects/**/*.mock.ts',
  'projects/**/*.html',
];

export const vscodeTestInclude = [
  'projects/opal-frontend-common/**/*.spec.ts',
  'projects/opal-frontend-common/**/*.test.ts',
];

export const testExclude = [...configDefaults.exclude, ...projectFileExclude];

export const coverageExclude = [...coverageConfigDefaults.exclude, ...projectFileExclude];
