// .eslintrc.cjs

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
          ['@components', './src/components'],
          ['@pages', './src/pages'],
          ['@hooks', './src/hooks'],
          ['@store', './src/store'],
          ['@services', './src/services'],
          ['@lib', './src/lib'],
          ['@assets', './src/assets'],
          ['@styles', './src/styles'],
        ],
        extensions: ['.js', '.jsx', '.json'],
      },
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime', // Enables React 18+ new JSX transform (no need for import React)
    'prettier', // Must be last to override conflicting rules
  ],
  plugins: ['react', 'react-hooks'],
  rules: {
    // React & JSX
    'react/prop-types': 'off', // Not using PropTypes (we can add TypeScript later if needed)
    'react/self-closing-comp': 'warn',
    'react/jsx-sort-props': ['warn', { callbacksLast: true, shorthandFirst: true }],
    'react/jsx-fragments': ['warn', 'syntax'],
    'react/jsx-no-useless-fragment': 'warn',
    'react/jsx-pascal-case': 'warn',

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Best Practices
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'prefer-const': 'error',

    // Code Style (enforced via Prettier where possible)
    'arrow-body-style': ['warn', 'as-needed'],
    curly: ['error', 'multi-line'],
  },
  overrides: [
    {
      // Specific rules for component/page files
      files: ['src/**/*.{jsx}'],
      rules: {
        // Pages may export default without being components
      },
    },
  ],
  ignorePatterns: ['dist/', 'node_modules/', '*.config.js', '*.cjs'],
};