const Path = require("path");
const Webpack = require("webpack");

const context = Path.resolve(__dirname, ".");
const source = context + "/source";
const output = context + "/dist";

module.exports = {
	context: source,
	entry: source + "/core/Main.js",
	target: "web",
	devtool: "inline-source-map",
	plugins: [
		new Webpack.ProgressPlugin(),
		new Webpack.ProvidePlugin({
			THREE: "three",
			"window.THREE": "three"
		})
	],
	module: {
		rules: [
			{
				test: /\.glsl$/i,
				use: "raw-loader",
			},
			{
				test: require.resolve("spine-runtimes/spine-ts/build/spine-threejs.js"),
				loader: "@shoutem/webpack-prepend-append",
				query: {
					append: "export {spine};"
				}
			}
		]
	},
	output: {
		filename: "bundle.js",
		path: output
	},
	module: {}
};
