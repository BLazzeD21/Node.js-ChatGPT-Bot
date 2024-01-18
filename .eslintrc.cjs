module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
    'plugin:@typescript-eslint/recommended',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 2021,
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
    'no-unused-vars': 1,
    'import/extensions': 0,
    'require-jsdoc': 0,
    'linebreak-style': 0,
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single'],
    'no-multi-str': 0,
    'guard-for-in': 0,
    'new-cap': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/no-unused-vars': 'warning',
  },
};
