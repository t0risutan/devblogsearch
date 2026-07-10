module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: { browser: true },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  overrides: [
    {
      files: ['playwright.config.js'],
      env: { node: true },
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['test/e2e/**/*.js'],
      env: { node: true },
      rules: {
        'import/extensions': 'off',
      },
    },
  ],
  rules: {
    // allow reassigning param
    'no-param-reassign': [2, { props: false }],
    'linebreak-style': ['error', 'unix'],
    'import/extensions': ['error', { js: 'always' }],
    'object-curly-newline': ['error', {
      ObjectExpression: { multiline: true, minProperties: 6 },
      ObjectPattern: { multiline: true, minProperties: 6 },
      ImportDeclaration: { multiline: true, minProperties: 6 },
      ExportDeclaration: 'never',
    }],
  },
};
