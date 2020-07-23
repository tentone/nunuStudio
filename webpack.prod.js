const Merge = require("webpack-merge");
const common = require("./webpack.config.js");

module.exports = [
	Merge(common[0], {
		devtool: "none",
		mode: "production",
		optimization: {
			minimize: true
		},
		plugins: []
	}),
	common[1]
];
