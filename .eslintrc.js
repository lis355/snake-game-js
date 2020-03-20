module.exports = {
	extends: [
		"react-app",
		"protop"
	],
	rules: {
		"no-debugger": 0
	},
	globals: {
		"ndapp": "writable",
		"app": "writable",
		"$t": "writable"
	}
};
