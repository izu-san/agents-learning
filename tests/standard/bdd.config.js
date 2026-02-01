const { defineBddConfig } = require('playwright-bdd');

module.exports = defineBddConfig({
  // NOTE: Paths are relative to this config directory.
  features: 'features/**/*.feature',
  steps: 'steps/**/*.ts',
  // NOTE: JS config is used to ensure bddgen can load it reliably on Windows.
  outputDir: 'features-gen',
});
