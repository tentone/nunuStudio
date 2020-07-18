const WebpackCleanupPlugin = require("webpack-cleanup-plugin");
const ReplaceInFileWebpackPlugin = require("replace-in-file-webpack-plugin");

const GitRevisionPlugin = require("git-revision-webpack-plugin");
const git = new GitRevisionPlugin();

const Path = require("path");
const Webpack = require("webpack");

const source = Path.resolve(__dirname, "source");
const output = Path.resolve(__dirname, "build/runtime");

module.exports = {
	context: source,
	entry: source + "/core/Main.js",
	target: "web",
	devtool: "none",
	mode: "production",
	optimization: {
		minimize: true
	},
	plugins: [
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
		new WebpackCleanupPlugin(),
		new Webpack.ProvidePlugin({
			THREE: "three",
			"window.THREE": "three"
		})
	],
	module: {
		rules: [
			{
				test: /\.glsl$/i,
				use: "raw-loader",
			},
			{
				test: /.*spine-threejs.*/,
				loader: "@shoutem/webpack-prepend-append",
				query: "{\"append\": \"export {spine};\"}"
			}
		]
	},
	output: {
		filename: "nunu.min.js",
		path: output
	}
};
