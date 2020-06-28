const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const WebpackCleanupPlugin  = require("webpack-cleanup-plugin");

const Merge = require("webpack-merge");
const common = require("./webpack.config.js");

module.exports = Merge(common, {
	devtool: "none",
	mode: "production",
	optimization: {
		minimize: true
	},
	plugins: [
		new WebpackCleanupPlugin(),
        new UglifyJSPlugin({sourceMap: false})
	]
});
