const Path = require("path");
const Webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const context = Path.resolve(__dirname, ".");
const source = context + "/source";
const output = context + "/dist";

module.exports = {
	context: source,
	entry: [source + "/editor/Editor.js"],
	target: "web",
	devtool: "inline-source-map",
	mode: "development",
	plugins: [
		new HtmlWebpackPlugin({template: source + "/editor/index.html", filename: "index.html"}),
		new Webpack.ProgressPlugin(),
		// new Webpack.NamedModulesPlugin(),
		// new Webpack.HotModuleReplacementPlugin()
	],
    optimization: {
        minimize: false
	},
	/*devServer: {
        contentBase: Path.join(__dirname, "dist"),
        compress: false,
        historyApiFallback: true,
        hot: true,
        https: false,
        noInfo: false
    },*/
	resolve: {
		modules: [source, "node_modules"]
	},
	output: {
		filename: "bundle.js",
		path: output
	},
	module: {}
};
