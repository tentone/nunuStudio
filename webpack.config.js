const Path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
const CopyPlugin = require("copy-webpack-plugin");

const context = Path.resolve(__dirname, ".");
const source = context + "/source";
const output = context + "/dist";

module.exports = {
	context: source,
	entry: source + "/editor/Main.js",
	target: "web",
	devtool: "inline-source-map",
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: source + "/files",
					to: output + "/files",
					force: true
				}
			],
			options: {
				concurrency: 100,
			}
		}),
		new HtmlWebpackPlugin({template: source + "/editor/index.html", filename: "index.html"}),
		new Webpack.ProgressPlugin(),
		new Webpack.ProvidePlugin({
			THREE: "three",
			"window.THREE": "three"
		}),
		new MergeIntoSingleFilePlugin({
			files: {
				"jscolor.js": [
					'lib/jscolor.min.js',
				],
				"jshint.js": [
					'lib/jshint.min.js',
				],
				"acorn.js": [
					'lib/acorn/acorn.js',
					'lib/acorn/acorn_loose.js',
					'lib/acorn/walk.js'
				],
				"tern.js": [
					'lib/tern/signal.js',
					'lib/tern/tern.js',
					'lib/tern/def.js',
					'lib/tern/comment.js',
					'lib/tern/infer.js',
					'lib/tern/plugin/doc_comment.js'
				],
				"codemirror.js": [
					'node_modules/codemirror/lib/codemirror.js',
					"node_modules/codemirror/keymap/sublime.js",
					"node_modules/codemirror/keymap/emacs.js",
					"node_modules/codemirror/keymap/vim.js",
					"node_modules/codemirror/mode/javascript/javascript.js",
					"node_modules/codemirror/mode/css/css.js",
					"node_modules/codemirror/mode/xml/xml.js",
					"node_modules/codemirror/mode/htmlmixed/htmlmixed.js",
					"node_modules/codemirror/addon/edit/closebrackets.js",
					"node_modules/codemirror/addon/edit/matchbrackets.js",
					"node_modules/codemirror/addon/scroll/annotatescrollbar.js",
					"node_modules/codemirror/addon/search/search.js",
					"node_modules/codemirror/addon/search/searchcursor.js",
					"node_modules/codemirror/addon/search/jump-to-line.js",
					"node_modules/codemirror/addon/search/match-highlighter.js",
					"node_modules/codemirror/addon/search/matchesonscrollbar.js",
					"node_modules/codemirror/addon/hint/show-hint.js",
					"node_modules/codemirror/addon/hint/anyword-hint.js",
					"node_modules/codemirror/addon/dialog/dialog.js",
					"node_modules/codemirror/addon/selection/mark-selection.js",
					"node_modules/codemirror/addon/selection/active-line.js",
					"node_modules/codemirror/addon/selection/selection-pointer.js",
					"node_modules/codemirror/addon/lint/lint.js",
					"node_modules/codemirror/addon/lint/javascript-lint.js",
					"node_modules/codemirror/addon/tern/tern.js",
					"node_modules/codemirror/addon/runmode/colorize.js",
					"node_modules/codemirror/addon/runmode/runmode.js",
					//"node_modules/glsl-editor/glsl.js",
				],
				"codemirror.css": [
					'node_modules/codemirror/lib/codemirror.css',
					'node_modules/codemirror/theme/**/*.css',
					"node_modules/codemirror/addon/search/matchesonscrollbar.css",
					"node_modules/codemirror/addon/tern/tern.css",
					"node_modules/codemirror/addon/dialog/dialog.css",
					"node_modules/codemirror/addon/lint/lint.css",
					"node_modules/codemirror/addon/hint/show-hint.css",
				]
			}
		}),
	],
	module: {
		loaders: [
		  {
			test: require.resolve("spine-runtimes/spine-ts/build/spine-threejs.js"),
			loader: '@shoutem/webpack-prepend-append',
			query: {
				append: 'export {spine};'
			}
		  }
		]
	},
	output: {
		filename: "bundle.js",
		path: output
	},
	module: {}
};
