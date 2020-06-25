import strip from "rollup-plugin-strip";

export default {
	input: "source/core/NunuApp.js",
	plugins: [
		strip(
		{
			functions: ["assert.*", "debug", "alert"],
			debugger: false,
			sourceMap: false
		})
	],
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
