const Path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MergeIntoSingleFilePlugin = require("webpack-merge-and-include-globally");
const CopyPlugin = require("copy-webpack-plugin");

const GitRevisionPlugin = require("git-revision-webpack-plugin");
const git = new GitRevisionPlugin();

const source = Path.resolve(__dirname, "source");
const output = Path.resolve(__dirname, "temp/build/editor");

const Merge = require("webpack-merge");
const runtime = require("./webpack.runtime.js");

module.exports = [
	{
		context: source,
		entry: source + "/editor/Main.js",
		target: "web",
		devtool: "inline-source-map",
		module: {
			rules: [
				/* {
					test: /\.js$/i,
					loader: "babel-loader",
					query: {presets: ["@babel/preset-env"]}
				},*/
				{
					test: /\.glsl$/i,
					use: "raw-loader"
				},
				{
					test: /.*spine-threejs.*/,
					loader: "@shoutem/webpack-prepend-append",
					query: JSON.stringify({append: "export {spine};"})
				},
				{
					test: /.*brython.*/,
					loader: "@shoutem/webpack-prepend-append",
					query: JSON.stringify({
						prepend: `(function (root, factory) {
						if (typeof define === 'function' && define.amd) { define([], factory); }  // AMD loader
						else if (typeof module === 'object' && module.exports) { module.exports = factory(); }  // CommonJS loader
						else { root.brython = factory(); }  // Script tag
						}(typeof self !== 'undefined' ? self : this, function () {
						var process = {release: {name: ''}};`,
						append: `window.__BRYTHON__ = __BRYTHON__;
						return brython;
						}));`
					})
				}
			]
		},
		output: {
			filename: "bundle.js",
			path: output
		},
		plugins: [
			new Webpack.DefinePlugin({
				"VERSION": JSON.stringify(require("./package.json").version),
				"TIMESTAMP": JSON.stringify(new Date().toISOString()),
				"REPOSITORY_BRANCH": JSON.stringify(git.branch()),
				"REPOSITORY_COMMIT": JSON.stringify(git.commithash()),
				"DEVELOPMENT": JSON.stringify(true)
			}),
			new CopyPlugin({
				patterns: [
					{
						from: source + "/files",
						to: output + "/files",
						force: true
					}
				],
				options: {concurrency: 100}
			}),
			new HtmlWebpackPlugin({template: source + "/editor/index.html", filename: "index.html"}),
			new Webpack.ProgressPlugin(),
			new Webpack.ProvidePlugin({
				THREE: "three",
				"window.THREE": "three"
			}),
			new MergeIntoSingleFilePlugin({
				files: {
					"package.json": [
						"package.json"
					],
					"styles.css": [
						"source/editor/style.css",
						"source/editor/theme/dark.css"
					],
					"draco_encoder.js": [
						"source/lib/draco_encoder.js"
					],
					"jshint.js": [
						"node_modules/jshint/dist/jshint.js"
					],
					"acorn.js": [
						"node_modules/acorn/dist/acorn.js",
						"node_modules/acorn-loose/dist/acorn-loose.js",
						"node_modules/acorn-walk/dist/walk.js"
					],
					"tern.js": [
						"node_modules/tern/lib/signal.js",
						"node_modules/tern/lib/tern.js",
						"node_modules/tern/lib/def.js",
						"node_modules/tern/lib/comment.js",
						"node_modules/tern/lib/infer.js",
						"node_modules/tern/plugin/doc_comment.js"
					],
					"codemirror.js": [
						"node_modules/codemirror/lib/codemirror.js",
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
						"node_modules/codemirror/addon/runmode/runmode.js"
					],
					"codemirror.css": [
						"node_modules/codemirror/lib/codemirror.css",
						"node_modules/codemirror/theme/**/*.css",
						"node_modules/codemirror/addon/search/matchesonscrollbar.css",
						"node_modules/codemirror/addon/tern/tern.css",
						"node_modules/codemirror/addon/dialog/dialog.css",
						"node_modules/codemirror/addon/lint/lint.css",
						"node_modules/codemirror/addon/hint/show-hint.css"
					]
				}
			})
		]
	},
	Merge(runtime[0], {
		output: {
			filename: "nunu.min.js",
			path: output + "/files/runtime",
			library: "Nunu",
			libraryTarget: "umd"
		}
	})
];
