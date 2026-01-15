const eslintConfig = [
  {
    ignores: ['node_modules/**', '.next/**', 'out/**'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
]
 
export default eslintConfig