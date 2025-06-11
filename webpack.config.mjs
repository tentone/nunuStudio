import path from "path";
import Webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MergeIntoSingleFilePlugin from "webpack-merge-and-include-globally";
import CopyPlugin from "copy-webpack-plugin";
import {merge} from "webpack-merge";
import runtime from "./webpack.runtime.mjs";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.resolve(__dirname, "source");
const output = path.resolve(__dirname, "docs/editor");


export default [
	{
		context: source,
		entry: source + "/editor/Main.js",
		target: "web",
		devtool: false,
		performance: {
			hints: false,
		},
		module: {
			rules: [
				{
					test: /\.glsl$/i,
					use: "raw-loader"
				},
				{
					test: /.*brython.*/,
					loader: "@shoutem/webpack-prepend-append",
					options: JSON.stringify({
						prepend: `(function (root, factory) {
						if (typeof define === 'function' && define.amd) { define([], factory); }  // AMD loader
						else if (typeof module === 'object' && module.exports) { module.exports = factory(); }  // CommonJS loader
						else { root.brython = factory(); }  // Script tag
						}(typeof self !== 'undefined' ? self : this, function () {
						var process = {release: {name: ''}};`,
						append: `window.__BRYTHON__ = __BRYTHON__;
						return __BRYTHON__;
						}));`
					})
				}
			]
		},
		output: {
			hashFunction: "sha256",
			filename: "bundle.js",
			path: output
		},
		plugins: [
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
						"node_modules/codemirror/mode/python/python.js",
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
	merge(runtime[0], {
		output: {
			hashFunction: "sha256",
			filename: "nunu.min.js",
			path: output + "/files/runtime",
			library: "Nunu",
			libraryTarget: "umd"
		}
	})
];
