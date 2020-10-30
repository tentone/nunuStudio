const Webpack = require("webpack");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const Merge = require("webpack-merge");

const git = new GitRevisionPlugin();

const common = require("./webpack.config.js");

module.exports = [
	Merge(common[0], {
		devtool: "inline-source-map",
		mode: "development",
		optimization: {minimize: false},
		devServer: {
			contentBase: common[0].output.path,
			compress: false,
			historyApiFallback: true,
			hot: true,
			https: false,
			noInfo: false
		},
		plugins: [
			new Webpack.DefinePlugin({
				"VERSION": JSON.stringify(require("./package.json").version),
				"TIMESTAMP": JSON.stringify(new Date().toISOString()),
				"REPOSITORY_BRANCH": JSON.stringify(git.branch()),
				"REPOSITORY_COMMIT": JSON.stringify(git.commithash()),
				"DEVELOPMENT": JSON.stringify(true)
			}),
			new Webpack.NamedModulesPlugin(),
			new Webpack.HotModuleReplacementPlugin()
		]
	}),
	common[1]
];
