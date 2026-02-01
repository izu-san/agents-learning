import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// NOTE: defineBddConfig is required for bddgen to discover feature/step configs.
const testDir = defineBddConfig({
  // NOTE: Paths are relative to this config directory.
  features: 'features/**/*.feature',
  steps: 'steps/**/*.ts',
  outputDir: 'features-gen',
});

export default defineConfig({
  // NOTE: Use BDD-generated tests directory produced by defineBddConfig.
  testDir,
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:8080/ja',
    trace: 'on-first-retry',
  },
});
