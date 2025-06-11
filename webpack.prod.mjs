import path from "path";
import {merge} from "webpack-merge";
import Webpack from "webpack";
import {GitRevisionPlugin} from "git-revision-webpack-plugin";
import common from "./webpack.config.mjs";
import pkg from "./package.json" assert { type: "json" };
import {fileURLToPath} from "url";

const git = new GitRevisionPlugin();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const output = path.resolve(__dirname, "docs/editor");

export default [
	merge(common[0], {
		devtool: false,
		mode: "production",
		optimization: {minimize: true},
		performance: {
			hints: false,
		},
		plugins: [
			new Webpack.DefinePlugin({
                                "VERSION": JSON.stringify(pkg.version),
				"TIMESTAMP": JSON.stringify(new Date().toISOString()),
				"REPOSITORY_BRANCH": JSON.stringify(git.branch()),
				"REPOSITORY_COMMIT": JSON.stringify(git.commithash()),
				"DEVELOPMENT": JSON.stringify(false)
			})
		],
		output: {
			hashFunction: "sha256",
			filename: "bundle.js",
			path: output
		}
	}),
	common[1]
];
