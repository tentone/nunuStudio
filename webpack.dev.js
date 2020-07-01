const Path = require("path");
const Webpack = require("webpack");
const Merge = require("webpack-merge");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
 
const common = require("./webpack.config.js");

module.exports = Merge(common, {
	devtool: "inline-source-map",
	mode: "development",
	optimization: {
		minimize: false,
		mangleWasmImports: false,
		namedModules: false,
		splitChunks: false,
		runtimeChunk: false,
		noEmitOnErrors: false,
	},
	devServer: {
		contentBase: Path.join(__dirname, "dist"),
		compress: false,
		historyApiFallback: true,
		hot: true,
		https: false,
		noInfo: false
	},
	plugins: [
		// new BundleAnalyzerPlugin(),
		new Webpack.NamedModulesPlugin(),
		new Webpack.HotModuleReplacementPlugin()
	]
});
