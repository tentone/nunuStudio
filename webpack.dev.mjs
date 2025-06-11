import Webpack from "webpack";
import {GitRevisionPlugin} from "git-revision-webpack-plugin";
import {merge} from "webpack-merge";
import {fileURLToPath} from "url";
import path from "path";

import common from "./webpack.config.mjs";
import pkg from "./package.json" assert { type: "json" };

const git = new GitRevisionPlugin();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
	merge(common[0], {
		mode: "development",
		optimization: {minimize: false},
		devtool: 'inline-source-map',
		performance: {
			hints: false,
		},
		devServer: {
			static: common[0].output.path,
			compress: false,
			historyApiFallback: true,
			hot: true,
			https: false
		},
		plugins: [
			new Webpack.DefinePlugin({
                                "VERSION": JSON.stringify(pkg.version),
				"TIMESTAMP": JSON.stringify(new Date().toISOString()),
				"REPOSITORY_BRANCH": JSON.stringify(git.branch()),
				"REPOSITORY_COMMIT": JSON.stringify(git.commithash()),
				"DEVELOPMENT": JSON.stringify(true)
			}),
			new Webpack.HotModuleReplacementPlugin()
		]
	}),
	common[1]
];
