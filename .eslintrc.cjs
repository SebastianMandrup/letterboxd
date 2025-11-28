module.exports = {
	root: true,
	parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
	env: { browser: true, node: true, es2021: true },
	overrides: [
		{
			files: ["letterboxd-frontend/src/**/*.{ts,tsx,js,jsx}"],
			parser: "@typescript-eslint/parser",
			plugins: ["react", "react-hooks", "@typescript-eslint", "jsx-a11y", "prettier"],
			extends: [
				"eslint:recommended",
				"plugin:react/recommended",
				"plugin:react-hooks/recommended",
				"plugin:@typescript-eslint/recommended",
				"plugin:jsx-a11y/recommended",
				"plugin:prettier/recommended"
			],
			settings: { react: { version: "detect" } },
			rules: {
				"prettier/prettier": "error",
				"react/react-in-jsx-scope": "off"
			}
		},
		{
			files: ["letterboxd-backend/src/**/*.{ts,js}"],
			parser: "@typescript-eslint/parser",
			plugins: ["@typescript-eslint", "prettier"],
			extends: [
				"eslint:recommended",
				"plugin:@typescript-eslint/recommended",
				"plugin:prettier/recommended"
			],
			rules: {
				"prettier/prettier": "error"
			}
		}
	]
};
