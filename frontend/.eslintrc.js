module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    // Basic rules for code quality
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'no-debugger': 'warn'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.d.ts'
  ]
}
