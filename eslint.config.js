import js from '@eslint/js'
import globals from 'globals'
<<<<<<< HEAD
import react from 'eslint-plugin-react'
=======
>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
<<<<<<< HEAD
  // Ignora a pasta de build
  globalIgnores(['dist', 'node_modules']),

  {
    files: ['**/*.{js,jsx}'],
    ignores: ['dist/**', 'node_modules/**'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    extends: [
      js.configs.recommended,
      react.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],

    rules: {
      // ⚙️ Boas práticas e preferências
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^[A-Z_]' }],
      'react/react-in-jsx-scope': 'off', // Desnecessário no Vite/React 17+
      'react/prop-types': 'off', // Se não usa PropTypes
      'react/jsx-uses-react': 'off', // JSX automático
      'react/jsx-uses-vars': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
=======
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
    },
  },
])
