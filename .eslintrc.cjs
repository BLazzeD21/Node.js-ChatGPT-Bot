module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': 'google',
  'overrides': [
    {
      'env': {
        'node': true,
      },
      'files': [
        '.eslintrc.{js,cjs}',
      ],
      'parserOptions': {
        'sourceType': 'script',
      },
    },
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'rules': {
    'no-unused-vars': 1,
    'import/extensions': 0,
    'require-jsdoc': 0,
    'linebreak-style': 0,
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single'],
    'no-multi-str': 0,
    'guard-for-in': 0,
  },
};
