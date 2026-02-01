import { defineBddConfig } from 'playwright-bdd';

export default defineBddConfig({
  // NOTE: Paths are relative to this config directory.
  features: 'features/**/*.feature',
  steps: 'steps/**/*.ts',
  // NOTE: Use a non-hidden folder to avoid generation issues on Windows.
  outputDir: 'features-gen',
});
