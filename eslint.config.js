import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

/**
 * Linting exists here for correctness and accessibility, not style — Prettier owns style.
 * jsx-a11y runs in strict mode because a11y is a hard requirement of this site (see
 * docs/design-system.md §6), not a nice-to-have.
 */
export default [
  { ignores: ['dist/', 'node_modules/', 'notes/', 'test-results/', 'scripts/'] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.strict,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        // Vite `define` constant (vite.config.js) — a literal at build time.
        __LAST_UPDATED__: 'readonly',
      },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Data-driven site: props are plain objects validated by dataIntegrity.test.js.
      'react/prop-types': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
    settings: { react: { version: 'detect' } },
  },
  {
    files: ['vite.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['src/test/**'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
]
