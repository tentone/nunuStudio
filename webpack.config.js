const Path = require("path");
const Webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const context = Path.resolve(__dirname, ".");
const source = context + "/source";
const output = context + "/dist";

module.exports = {
	context: source,
	entry: ["./index.js"],
	target: "web",
	resolve: {
		modules: [source, "node_modules"]
	},
	output: {
		filename: "bundle.js",
		path: output
	},
	plugins: [
		new HtmlWebpackPlugin({template: Path.resolve(__dirname, '../../src', 'index.html'), filename: "index.html"}),
		new Webpack.ProgressPlugin(),
	],
	module: {}
};
