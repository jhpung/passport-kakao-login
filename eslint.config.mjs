import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

const compat = new FlatCompat({ baseDirectory: process.cwd() })

export default defineConfig([
  globalIgnores(['dist/**', 'node_modules/**', 'coverage/**']),
  {
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      compat.extends('google'),
      eslintConfigPrettier,
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      // google config는 ESLint 코어에서 이미 제거된 JSDoc 강제 규칙을 포함하고,
      // 타입 정보는 TypeScript가 대체하므로 끈다.
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',
    },
  },
])
