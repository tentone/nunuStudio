const NwjsWebpackPlugin = require('nwjs-webpack-plugin');

const Merge = require("webpack-merge");
const common = require("./webpack.prod.js");

module.exports = Merge(common, {
	target: 'node-webkit',
	plugins: [
		new NwjsWebpackPlugin()
	]
});
