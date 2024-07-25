// @ts-check

import antfu, { GLOB_SRC } from '@antfu/eslint-config'
import perfectionist from 'eslint-plugin-perfectionist'

export default antfu({
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
  },
  react: {
    overrides: {
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': ['error', {
        additionalHooks: 'useIsomorphicEffect|useDeepMemo',
      }],
      'react/jsx-boolean-value': ['error', 'never', { always: [] }],
      'react/jsx-key': 'off',
      'react/jsx-handler-names': ['error', {
        eventHandlerPrefix: 'handle',
        eventHandlerPropPrefix: 'on',
      }],
    },
  },
  stylistic: {
    overrides: {
      'style/jsx-curly-spacing': ['error', { when: 'never', children: true }],
      'style/jsx-props-no-multi-spaces': 'error',
      'style/max-statements-per-line': ['error', { max: 4 }],
      'style/no-extra-parens': ['error', 'all', {
        ignoreJSX: 'all',
        conditionalAssign: true,
        returnAssign: false,
        nestedBinaryExpressions: false,
        enforceForArrowConditionals: false,
        enforceForSequenceExpressions: false,
      }],
    },
  },
  rules: {
    'antfu/if-newline': 'off',
    'node/prefer-global/process': 'off',
    'import/order': 'off',
    'no-console': 'off',
    'no-else-return': ['error', { allowElseIf: false }],
    'no-restricted-syntax': [
      'error',
      {
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        selector: 'ForInStatement',
      },
      {
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        selector: 'LabeledStatement',
      },
      {
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        selector: 'WithStatement',
      },
    ],
  },
}).overrides({
  'antfu/react/rules': { files: [GLOB_SRC] },
  'antfu/perfectionist/setup': {
    rules: {
      ...perfectionist.configs['recommended-natural'].rules,
      'perfectionist/sort-objects': 'off',
      'perfectionist/sort-interfaces': 'off',
      'perfectionist/sort-classes': 'off',
      'perfectionist/sort-jsx-props': ['off', {
        'type': 'natural',
        'order': 'asc',
        'groups': ['unique', 'style', 'shorthand', 'unknown', 'multiline', 'callback'],
        'custom-groups': { callback: 'on*', key: 'key', ref: 'ref', unique: '{ref,key}', style: '{className,style}' },
      }],
    },
  },
})
