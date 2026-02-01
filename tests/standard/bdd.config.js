const { defineBddConfig } = require('playwright-bdd');

module.exports = defineBddConfig({
  // NOTE: Paths are relative to this config directory.
  features: 'features/**/*.feature',
  // NOTE: Include fixtures to ensure custom test instance is discovered.
  steps: ['steps/**/*.ts', 'fixtures/test.ts'],
  // NOTE: JS config is used to ensure bddgen can load it reliably on Windows.
  outputDir: 'features-gen',
});
