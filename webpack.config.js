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
		new Webpack.ProgressPlugin(),
		new Webpack.ProvidePlugin({
			THREE: "three",
			"window.THREE": "three"
		})
	],
	resolve: {
		modules: [source, "node_modules"],
		extensions: [".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader'
			}
		],
		loaders: [
			{
				test: /.*spine-threejs.*/,
				loader: '@shoutem/webpack-prepend-append',
				query: {
					prepend: '',
					append: '\n\nexport { spine };'
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
