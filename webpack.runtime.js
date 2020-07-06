const WebpackCleanupPlugin = require("webpack-cleanup-plugin");

const Path = require("path");
const Webpack = require("webpack");

const context = Path.resolve(__dirname, ".");
const source = context + "/source";
const output = context + "/dist";

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
