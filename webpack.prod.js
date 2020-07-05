const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const WebpackCleanupPlugin  = require("webpack-cleanup-plugin");

const Merge = require("webpack-merge");
const common = require("./webpack.config.js");

module.exports = Merge(common, {
	devtool: "none",
	mode: "production",
	optimization: {
		minimizer: [new UglifyJSPlugin(),],
	},
	plugins: [
		new WebpackCleanupPlugin()
	]
});
