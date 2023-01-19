module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		"node": true
	},
	"extends": [
		"plugin:@typescript-eslint/recommended",
		"plugin:nuxt/recommended"
	],
	"overrides": [
	],
	"ignorePatterns": ["parser/dist/**", "node_modules", "docs/**"],
	"parser": "vue-eslint-parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module",
		"parser": "@typescript-eslint/parser"
	},
	"plugins": [
		"vue",
		"@typescript-eslint"
	],
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"never"
		],
		"@typescript-eslint/no-this-alias": "off"
	}
}
