import { defineConfig } from 'vitest/config';

import { coverageExclude, testExclude } from './vitest.shared';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    disableConsoleIntercept: true,
    setupFiles: ['projects/opal-frontend-common/test-setup.ts'],
    exclude: testExclude,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      exclude: coverageExclude,
    },
  },
});
