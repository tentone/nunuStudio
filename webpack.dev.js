const Webpack = require("webpack");
const Merge = require("webpack-merge");
 
const common = require("./webpack.config.js");

module.exports = [
	Merge(common[0], {
		devtool: "inline-source-map",
		mode: "development",
		optimization: {
			minimize: false
		},
		devServer: {
			contentBase: common.output.path,
			compress: false,
			historyApiFallback: true,
			hot: true,
			https: false,
			noInfo: false
		},
		plugins: [
			new Webpack.NamedModulesPlugin(),
			new Webpack.HotModuleReplacementPlugin()
		]
	}),
	common[1]
];
