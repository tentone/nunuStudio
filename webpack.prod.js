const Path = require("path");
const Merge = require("webpack-merge");
const Webpack = require("webpack");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const common = require("./webpack.config.js");

const git = new GitRevisionPlugin();

const output = Path.resolve(__dirname, "docs/editor");

module.exports = [
	Merge(common[0], {
		devtool: "none",
		mode: "production",
		optimization: {minimize: true},
		plugins: [
			new Webpack.DefinePlugin({
				"VERSION": JSON.stringify(require("./package.json").version),
				"TIMESTAMP": JSON.stringify(new Date().toISOString()),
				"REPOSITORY_BRANCH": JSON.stringify(git.branch()),
				"REPOSITORY_COMMIT": JSON.stringify(git.commithash()),
				"DEVELOPMENT": JSON.stringify(false)
			})
		],
		output: {
			filename: "bundle.js",
			path: output
		}
	}),
	common[1]
];
