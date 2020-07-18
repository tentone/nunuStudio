const Path = require("path");
const Webpack = require("webpack");

const source = Path.resolve(__dirname, "source");
const output = Path.resolve(__dirname, "build/runtime");

const config = {
	context: source,
	entry: source + "/core/Main.js",
	target: "web",
	devtool: "none",
	mode: "production",
	optimization: {
		minimize: true
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
				use: "raw-loader",
			},
			{
				test: /.*spine-threejs.*/,
				loader: "@shoutem/webpack-prepend-append",
				query: "{\"append\": \"export {spine};\"}"
			}
		]
	}
};


module.exports = [
	Object.assign({
		output: {
			filename: "nunu.min.js",
			path: output,
			library: 'Nunu',
			libraryTarget: 'umd'	
		}
	}, config),
	Object.assign({
		output: {
			filename: "nunu.module.min.js",
			path: output,
			libraryTarget: 'umd'	
		}
	}, config),
];


libraryTarget: 'umd'