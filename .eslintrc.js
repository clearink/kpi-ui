module.exports = {
  extends: [
    '@antfu/eslint-config-ts',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:perfectionist/recommended-natural',
  ],
  ignorePatterns: ['dist', 'esm', 'lib'],
  plugins: ['react-refresh', 'perfectionist'],
  root: true,
  rules: {
    '@typescript-eslint/consistent-type-imports': ['error', {
      fixStyle: 'inline-type-imports',
      prefer: 'type-imports',
    }],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTaggedTemplates: true,
        allowTernary: true,
      },
    ],
    // typescript
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-use-before-define': [
      'warn',
      {
        classes: false,
        functions: false,
        typedefs: false,
        variables: false,
      },
    ],
    'antfu/if-newline': 'off',
    'curly': ['error', 'multi-line', 'consistent'],
    'import/order': 'off', // handled by perfectionist

    'max-statements-per-line': ['error', { max: 4 }],
    'n/prefer-global/process': 'off',
    'no-console': 'off',

    // eslint
    'no-restricted-syntax': [
      'error',
      {
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        selector: 'ForInStatement',
      },
      {
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        selector: 'LabeledStatement',
      },
      {
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        selector: 'WithStatement',
      },
    ],
    'perfectionist/sort-exports': 'error',

    'perfectionist/sort-imports': 'error',

    'perfectionist/sort-named-imports': 'error',

    'react/destructuring-assignment': 'off',
    // react
    'react/jsx-props-no-spreading': 'off',
    // react-hooks
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: 'useIsomorphicEffect|useDeepMemo',
      },
    ],
  },
}
