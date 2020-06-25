export default {
	input: "source/editor/Editor.js",
	plugins: [],
	output: [
		{
			format: "umd",
			name: "Nunu",
			file: "build/nunu.editor.js",
			indent: "\t"
		},
		{
			format: "es",
			file: "build/nunu.editor.module.js",
			indent: "\t"
		}
	]
};
