import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['projects/opal-frontend-common/test-setup.ts'],
    exclude: [
      'projects/**/public-api.ts',
      'projects/**/*.routing.ts',
      'projects/**/*.routes.ts',
      'projects/**/*.constant.ts',
      'projects/**/*.interface.ts',
      'projects/**/*.type.ts',
      'projects/**/*.mock.ts',
      'projects/**/*.html',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      exclude: [
        'projects/**/public-api.ts',
        'projects/**/*.routing.ts',
        'projects/**/*.routes.ts',
        'projects/**/*.constant.ts',
        'projects/**/*.interface.ts',
        'projects/**/*.type.ts',
        'projects/**/*.mock.ts',
        'projects/**/*.html',
      ],
    },
  },
});
