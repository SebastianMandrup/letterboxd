module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
		ecmaFeatures: { jsx: true },
	},
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	plugins: [
		'react',
		'react-hooks',
		'@typescript-eslint',
		'jsx-a11y',
		'prettier',
	],
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:jsx-a11y/recommended',
		'plugin:prettier/recommended',
	],
	rules: {
		'prettier/prettier': 'error',
		'react/react-in-jsx-scope': 'off',
	},
	settings: {
		react: { version: 'detect' },
	},
};