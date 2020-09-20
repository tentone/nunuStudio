const Path = require("path");
const Merge = require("webpack-merge");
const common = require("./webpack.config.js");

const output = Path.resolve(__dirname, "build/editor");

module.exports = [
	Merge(common[0], {
		devtool: "none",
		mode: "production",
		optimization: {minimize: true},
		plugins: [],
		output: {
			filename: "bundle.js",
			path: output
		}
	}),
	common[1]
];
