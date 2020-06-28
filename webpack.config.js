const Path = require("path");
const Webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const context = Path.resolve(__dirname, ".");
const source = context + "/source";
const output = context + "/dist";

module.exports = {
	context: source,
	entry: [source + "/editor/Main.js"],
	target: "web",
	devtool: "inline-source-map",
	plugins: [
		new HtmlWebpackPlugin({template: source + "/editor/index.html", filename: "index.html"}),
		new Webpack.ProgressPlugin()
	],
	resolve: {
		modules: [source, "node_modules"]
	},
	output: {
		filename: "bundle.js",
		path: output
	},
	module: {}
};
