import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import { normalizePath } from 'vite';

import { inlineAngularComponentResourcesPlugin } from './tools/vitest/inline-angular-component-resources.plugin';
import { coverageExclude, testExclude, vscodeTestInclude } from './vitest.shared';

const projectRoot = normalizePath(resolve(__dirname, 'projects/opal-frontend-common'));

export default defineConfig({
  plugins: [inlineAngularComponentResourcesPlugin(projectRoot)],
  resolve: {
    alias: [
      {
        find: /^@hmcts\/opal-frontend-common$/,
        replacement: `${projectRoot}/public-api.ts`,
      },
      {
        find: /^@hmcts\/opal-frontend-common\/(.*)$/,
        replacement: `${projectRoot}/$1/public-api.ts`,
      },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    disableConsoleIntercept: true,
    include: vscodeTestInclude,
    setupFiles: ['projects/opal-frontend-common/test-setup.vscode.ts'],
    exclude: testExclude,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      exclude: coverageExclude,
    },
  },
});
