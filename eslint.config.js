const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');
const boundaries = require('eslint-plugin-boundaries');
const { defineConfig } = require('eslint/config');

// Libraries only core/db (plus src/test) or core/integrations may import.
const DB_LIBRARIES = ['expo-sqlite', 'drizzle-orm', 'better-sqlite3'];
const INTEGRATION_LIBRARIES = ['expo-iap'];

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app' },
        { type: 'feature', pattern: 'src/features/*', capture: ['feature'] },
        { type: 'core', pattern: 'src/core/*', capture: ['module'] },
        { type: 'test-support', pattern: 'src/test' },
      ],
      'boundaries/files': [{ category: 'test', pattern: '**/*.test.{ts,tsx}' }],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'allow',
          checkAllOrigins: true,
          policies: [
            {
              from: { element: { type: 'core' } },
              disallow: { to: { element: { type: ['feature', 'app'] } } },
              message: 'core must not import features or routes.',
            },
            {
              from: { element: { type: 'feature' } },
              disallow: { to: { element: { type: ['feature', 'app'] } } },
              message:
                'Features must not import other features or routes; move shared code to core.',
            },
            {
              from: { element: { type: 'feature' } },
              allow: {
                to: {
                  element: {
                    type: 'feature',
                    captured: { feature: '{{from.element.captured.feature}}' },
                  },
                },
              },
            },
            {
              disallow: { to: { element: { type: 'test-support' } } },
              message: 'Only tests may import src/test.',
            },
            {
              from: [{ file: { categories: 'test' } }, { element: { type: 'test-support' } }],
              allow: { to: { element: { type: 'test-support' } } },
            },
            {
              disallow: { to: { module: { origin: 'external', source: DB_LIBRARIES } } },
              message: 'Only core/db may import {{to.module.source}}; use a repository.',
            },
            {
              from: [
                { element: { type: 'core', captured: { module: 'db' } } },
                { element: { type: 'test-support' } },
              ],
              allow: { to: { module: { origin: 'external', source: DB_LIBRARIES } } },
            },
            {
              disallow: { to: { module: { origin: 'external', source: INTEGRATION_LIBRARIES } } },
              message: 'Only core/integrations may import {{to.module.source}}.',
            },
            {
              from: { element: { type: 'core', captured: { module: 'integrations' } } },
              allow: { to: { module: { origin: 'external', source: INTEGRATION_LIBRARIES } } },
            },
          ],
        },
      ],
    },
  },
]);
