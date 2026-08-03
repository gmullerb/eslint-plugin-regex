import { defineConfig } from 'eslint/config'
import baseStyleConfig from 'eslint-plugin-base-style-config'
import parser from 'any-eslint-parser'
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
      "**/build/**",
      "**/tests/e2e/case-*.*"
    ]
  },
  {
    extends: compat.extends('plugin:base-style-config/common-rules'),
    plugins: {
      'base-style-config': baseStyleConfig,
    },
    languageOptions: {
      parser: parser,
    },
    files: [
      "**/[\\.a-zA-Z]*.+(js|jsx|ts|tsx|json|yml|xml|sh|txt|md|svg|properties|gradle|java|cpp|c|html|css|groovy)",
      "**/.+(|gitignore|npmignore)"
    ]
  }
])
