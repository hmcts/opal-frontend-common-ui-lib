import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./projects/opal-frontend-common/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      enabled: true,
      reportsDirectory: './coverage',
      clean: false,
    },
  },
});
