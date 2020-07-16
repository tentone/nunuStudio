const WebpackCleanupPlugin = require("webpack-cleanup-plugin");

const Path = require("path");
const Webpack = require("webpack");

const source = Path.resolve(__dirname, "source");
const output = Path.resolve(__dirname, "build/runtime");

module.exports = {
	context: source,
	entry: source + "/core/Main.js",
	target: "web",
	devtool: "none",
	mode: "production",
	optimization: {
		minimize: true
	},
	plugins: [
		new WebpackCleanupPlugin(),
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
				test: /.*spine-threejs.*/,
				loader: "@shoutem/webpack-prepend-append",
				query: "{\"append\": \"export {spine};\"}"
			}
		]
	},
	output: {
		filename: "nunu.min.js",
		path: output
	}
};
