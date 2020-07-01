const Path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
const CopyPlugin = require("copy-webpack-plugin");

const context = Path.resolve(__dirname, ".");
const source = context + "/source";
const output = context + "/dist";

module.exports = {
	context: source,
	entry: source + "/editor/Main.js",
	target: "web",
	devtool: "inline-source-map",
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: source + "/files",
					to: output + "/files",
					force: true
				}
			],
			options: {
				concurrency: 100,
			}
		}),
		new HtmlWebpackPlugin({template: source + "/editor/index.html", filename: "index.html"}),
		new Webpack.ProgressPlugin(),
		new Webpack.ProvidePlugin({
			THREE: "three",
			"window.THREE": "three"
		}),
		new MergeIntoSingleFilePlugin({
			files: {
				"codemirror.js": [
					'node_modules/codemirror/bin/codemirror.js',
					'node_modules/codemirror/keymap/**/*.js',
					'node_modules/codemirror/addon/**/*.js',
					'node_modules/codemirror/mode/javascript/**/*.js',
					'node_modules/codemirror/mode/css/**/*.js',
					'node_modules/codemirror/mode/htmlmixed/**/*.js',
					'node_modules/codemirror/mode/xml/**/*.js',
				],
				"codemirror.css": [
					'node_modules/codemirror/bin/codemirror.css',
					'node_modules/codemirror/theme/**/*.css',
				]
			}
		}),
	],
	module: {
		loaders: [
		  {
			test: require.resolve("spine-runtimes/spine-ts/build/spine-threejs.js"),
			loader: '@shoutem/webpack-prepend-append',
			query: {
				append: 'export {spine};'
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
