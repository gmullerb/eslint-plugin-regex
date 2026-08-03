import { defineConfig } from 'eslint/config'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default defineConfig([
  {
    ignores: [
      '**/build/**',
      '**/tests/e2e/case-*.*',
    ]
  },
  {
    extends: compat.extends(
      'plugin:base-style-config/js-rules',
    ),
    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 6,
      sourceType: 'commonjs',
    },
    files: ['lib/**/*.js', 'tests/**/*.js'],
    rules: {
      'curly': ['error', 'multi', 'consistent'],
      'global-require': 'error',
      'init-declarations': 'off',
      'max-params': 'off',
      'no-console': 'error',
      'no-invalid-this': 'error',
      'no-mixed-requires': 'error',
      'no-new-require': 'error',
      'no-param-reassign': 'off',
      'object-curly-newline': ['error', {
        consistent: true,
      }],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'valid-jsdoc': 'off',
    },
  },
  {
    files: ['tests/**/*.js'],
    rules: {
      'curly': 'off',
      'global-require': 'off',
      'no-console': 'off',
      'no-throw-literal': 'off',
      'max-lines': 'off',
    },
  }
])
