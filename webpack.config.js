const Path = require("path");
const Webpack = require('webpack');
const context = Path.resolve(__dirname, ".");
const src = context + "/src";
const dist = context + "/docs";

module.exports = {
	context: src,
	output: {
		filename: "bundle.js",
		path: dist
	},
	resolve: {
		modules: [src, "node_modules"]
	},
	plugins: [
		new Webpack.ProgressPlugin(),
	],
	module: {
		rules: [
			// JS Code
			{
				test: /\.(js)$/,
				exclude: /(node_modules)/,
				loader: "babel-loader"
			},
			// HTML Files
			{
				test: /\.html$/,
				loader: "html-loader"
			},
			// Images
			{
				test: /\.(png|svg|jpg|gif|jpeg|css)$/,
				loader: "file-loader",
				options: {
					emitFile: true,
					esModule: false,
					name: '[name].[ext]',
				},
			}
		],
	}
};
