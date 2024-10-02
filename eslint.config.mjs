import globals from 'globals'

import pluginJs from '@eslint/js'
import tsEslint from 'typescript-eslint'

import pluginVue from 'eslint-plugin-vue'

// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  pluginJs.configs.recommended,

  ...tsEslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    languageOptions: {
      globals: globals.browser,

      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: './tsconfig.json',
      },
    },

    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

      'vue/component-name-in-template-casing': [
        'error',
        'kebab-case',
        {
          registeredComponentsOnly: false,
        },
      ],

      'vue/singleline-html-element-content-newline': 'off',

      'unicorn/prefer-type-error': 'off',

      'camelcase': 'off',

      'vue/no-multiple-template-root': 'off',
      'vue/multi-word-component-names': 0,
      'vue/component-tags-order': 0,

      '@typescript-eslint/prefer-optional-chain': ['warn'],

      '@stylistic/space-before-function-paren': ['warn', 'always'],

      'vue/no-mutating-props': ['warn'],

      'import/order': [
        'error',
        {
          pathGroups: [
            {
              pattern: '@/**',
              group: 'external',
            },
          ],
        },
      ],
    },
  },
)
