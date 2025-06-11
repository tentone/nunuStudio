import path from "path";
import Webpack from "webpack";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.resolve(__dirname, "source");
const output = path.resolve(__dirname, "dist");

const config = {
	context: source,
	entry: source + "/core/Main.js",
	target: "web",
	devtool: false,
	mode: "production",
	optimization: {minimize: true},
	performance: {
		hints: false,
	},
	plugins: [
		new Webpack.ProvidePlugin({
			THREE: "three",
			"window.THREE": "three"
		})
	],
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
	}
};

export default [
	Object.assign({
		output: {
			hashFunction: "sha256",
			filename: "nunu.min.js",
			path: output,
			library: "Nunu",
			libraryTarget: "umd"
		}
	}, config),
	Object.assign({
		output: {
			hashFunction: "sha256",
			filename: "nunu.module.min.js",
			path: output,
			libraryTarget: "umd"
		}
	}, config)
];
