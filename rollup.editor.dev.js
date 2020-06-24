import serve from "rollup-plugin-serve";

export default {
	input: "source/editor/Main.js",
	plugins: [
		serve({
			open: true,
			contentBase: '.',
			openPage: '/examples',
			host: 'localhost',
			port: 8080
		})
	],
	output: [
		{
			format: "umd",
			name: "Nunu",
			file: "build/nunu.js",
			indent: "\t"
		}
	]
};
