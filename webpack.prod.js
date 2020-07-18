const WebpackCleanupPlugin  = require("webpack-cleanup-plugin");
const ReplaceInFileWebpackPlugin = require("replace-in-file-webpack-plugin");

const GitRevisionPlugin = require("git-revision-webpack-plugin");
const git = new GitRevisionPlugin();

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
		new ReplaceInFileWebpackPlugin([{
			dir: "source/core",
			files: ["Nunu.js"],
			rules: [
				{search: "__PLACEHOLDER_VERSION__", replace: require("./package.json").version},
				{search: "__PLACEHOLDER_TIMESTAMP__", replace: new Date().toISOString()},
				{search: "__PLACEHOLDER_REPOSITORY_BRANCH__", replace: git.branch()},
				{search: "__PLACEHOLDER_REPOSITORY_COMMIT__", replace: git.commithash()}
			]
		}]),
	]
});
