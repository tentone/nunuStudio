import strip from "rollup-plugin-strip";

export default {
	input: "source/core/NunuApp.js",
	plugins: [],
	output: [
		{
			format: "umd",
			name: "Nunu",
			file: "build/nunu.js",
			indent: "\t"
		},
		{
			format: "es",
			file: "build/nunu.module.js",
			indent: "\t"
		}
	]
};
