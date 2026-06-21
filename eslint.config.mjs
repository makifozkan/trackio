// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  ...storybook.configs['flat/recommended'],
  {
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': [
        'warn',
        {
          printWidth: 100,
          semi: true,
          singleQuote: true,
          trailingComma: 'es5',
          tabWidth: 2,
        },
      ],
    },
  },
]);

export default eslintConfig;
